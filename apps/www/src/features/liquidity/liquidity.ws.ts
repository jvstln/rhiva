import { queryClient } from "@/lib";
import { useWebSocket } from "@/lib/ws";
import { merge } from "lodash";
import { useEffect } from "react";
import { produce } from "immer";

import type { LiquidityPool } from "./liquidity.type";

/**
 * PoolStateEvent carries its dex as a snake_case serde tag (meteora_dlmm),
 * while the REST LiquidityPool uses kebab-case (meteora-dlmm) — drop it so
 * the feed can't clobber the value the REST layer set.
 */
const toPoolDelta = (event: Partial<LiquidityPool>): Partial<LiquidityPool> => {
  const delta = { ...event };
  delete delta.dex;
  return delta;
};

const mergePools = (
  oldPools: LiquidityPool[],
  newPools: Partial<LiquidityPool>[],
) => {
  return produce(oldPools, (oldTokensDraft) => {
    newPools.forEach((newToken) => {
      const oldTokenMatch = oldTokensDraft.find(
        (oldToken) => oldToken.pool_address === newToken.pool_address,
      );
      if (!oldTokenMatch) return;
      merge(oldTokenMatch, toPoolDelta(newToken));
    });
  });
};

let poolsRefreshTimer: ReturnType<typeof setTimeout> | null = null;
const pendingPoolDeltas: Partial<LiquidityPool>[] = [];

/**
 * pools_all floods one PoolStateEvent per frame (~60/s); coalesce the
 * deltas into a single cache write per second instead of re-rendering the
 * pools table for every frame.
 */
const flushPendingPoolDeltas = () => {
  poolsRefreshTimer = null;
  if (pendingPoolDeltas.length === 0) return;
  const events = pendingPoolDeltas.splice(0);
  // useLiquidityPools keys its cache by filters (["liquidity","pools",
  // params]), so patch every pools query instead of a key nothing reads.
  queryClient.setQueriesData(
    { queryKey: ["liquidity", "pools"] },
    (oldData: LiquidityPool[] | undefined) => mergePools(oldData ?? [], events),
  );
};

const schedulePoolsRefresh = () => {
  if (poolsRefreshTimer) return;
  poolsRefreshTimer = setTimeout(flushPendingPoolDeltas, 1000);
};

export const useLiquidityWebsocket = () => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const poolsAllSub = subscribe<Partial<LiquidityPool>>({
      payload: { channel: "pools_all" },
      onMessage(msg) {
        // Each NATS pool-state message is a single PoolStateEvent; accept
        // both forms in case the gateway ever batches.
        const events = Array.isArray(msg.data) ? msg.data : [msg.data];
        pendingPoolDeltas.push(...events);
        schedulePoolsRefresh();
      },
    });

    return () => {
      poolsAllSub();
    };
  }, [subscribe]);
};

export const useLiquidityPoolWebsocket = (address: string) => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    if (!address) return;

    const poolSub = subscribe<Partial<LiquidityPool>>({
      payload: { channel: "pools", key: address },
      onMessage(msg) {
        const events = Array.isArray(msg.data) ? msg.data : [msg.data];
        if (!events.some((event) => event.pool_address === address)) return;

        queryClient.setQueryData(
          ["liquidity", "pool", address],
          (oldData: LiquidityPool | undefined) => {
            if (!oldData) return oldData;
            return mergePools([oldData], events)[0];
          },
        );
      },
    });

    return () => {
      poolSub();
    };
  }, [address, subscribe]);
};

export const useLiquidityDetailsWebsocket = (address: string) => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    if (!address) return;

    // The `liquidity` channel key is the pool address (despite the API doc
    // saying "token mint" — the backend publishes to solana.liquidity.
    // {pool_address}, see subjects::liquidity_event).
    const liquiditySub = subscribe({
      payload: { channel: "liquidity", key: address },
      onMessage() {
        // The payload is a delta (amounts added/removed), not new totals —
        // refetch the pool so its tvl/liquidity fields reflect the change.
        queryClient.invalidateQueries({
          queryKey: ["liquidity", "pool", address],
        });
      },
    });

    return () => {
      liquiditySub();
    };
  }, [address, subscribe]);
};
