import { queryClient } from "@/lib";
import { useWebSocket } from "@/lib/ws";
import type {
  BondingView,
  HolderSnapshotRow,
  TokenDetail,
  TradeRow,
  TrenchesRow,
} from "@rhivadotfun/dataapi";
import { produce } from "immer";
import { useEffect } from "react";

/** Radar columns → getTrenches stage values. */
const RADAR_STAGES = {
  fresh: "new_creation",
  heatingUp: "near_completion",
  graduated: "completed",
} as const;

const RADAR_COLUMNS = ["fresh", "heatingUp", "graduated"] as const;

const MAX_LIVE_TRADES = 100;

/**
 * Ranking feeds (trending/surge/trenches) push a FULL snapshot each
 * interval, so the cache must be reconciled — not just patched — or stale
 * tokens never leave the list. Feed rows are slimmer than the enriched
 * TokenDetail the REST layer produces, so merge each row over the cached
 * token (by mint) to keep fields the feed doesn't carry (live, social, ...).
 */
const reconcileSnapshot = <T extends { mint: string }>(
  oldTokens: TokenDetail[] | undefined,
  snapshot: T[],
): TokenDetail[] => {
  const cachedByMint = new Map(
    (oldTokens ?? []).map((token) => [token.mint, token]),
  );
  return snapshot.map((row) => {
    const cached = cachedByMint.get(row.mint);
    return cached ? { ...cached, ...row } : (row as unknown as TokenDetail);
  });
};

/**
 * Trenches rows carry bonding-curve fields at the root; surface them on the
 * enriched token's `bonding` object where the Radar card reads them.
 */
const reconcileTrenches = (
  oldTokens: TokenDetail[] | undefined,
  rows: Array<TokenDetail | TrenchesRow>,
): TokenDetail[] =>
  rows.map((row) => {
    const cached = (oldTokens ?? []).find((token) => token.mint === row.mint);
    if (!cached) return row as TokenDetail;
    if ("bonding" in row) return { ...cached, ...row };
    return {
      ...cached,
      ...row,
      bonding: {
        ...cached.bonding,
        completion_pct: row.completion_pct,
        stage: row.stage,
        virtual_sol_reserves: row.virtual_sol_reserves,
      },
    };
  });

let freshRefreshTimer: ReturnType<typeof setTimeout> | null = null;

/** Coalesce bursts of launch events into a single Radar "fresh" refetch. */
const scheduleFreshRefresh = () => {
  if (freshRefreshTimer) return;
  freshRefreshTimer = setTimeout(() => {
    freshRefreshTimer = null;
    queryClient.invalidateQueries({ queryKey: ["market", "radar", "fresh"] });
  }, 2000);
};

/** Patch a single token in the cache `useToken(mint)` reads. */
const updateToken = (mint: string, apply: (draft: TokenDetail) => void) => {
  queryClient.setQueryData(
    ["token", mint],
    (oldData: TokenDetail | undefined) =>
      oldData ? produce(oldData, apply) : oldData,
  );
};

export const useMarketWebsocket = () => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const trendingSub = subscribe<TokenDetail[]>({
      payload: { channel: "trending" },
      onMessage(msg) {
        queryClient.setQueryData(
          ["market", "trending"],
          (oldData: TokenDetail[] | undefined) =>
            reconcileSnapshot(oldData, msg.data),
        );
      },
    });

    const surgeSub = subscribe<TokenDetail[]>({
      payload: { channel: "surge" },
      onMessage(msg) {
        // useSurgeTokens keys its cache by filters (["market","surge",params]),
        // so patch every surge query instead of a key nothing reads.
        queryClient.setQueriesData(
          { queryKey: ["market", "surge"] },
          (oldData: TokenDetail[] | undefined) =>
            reconcileSnapshot(oldData, msg.data),
        );
      },
    });

    const trenchesSub = subscribe<Array<TokenDetail | TrenchesRow>>({
      payload: { channel: "trenches" },
      onMessage(msg) {
        // The trenches feed is a full snapshot of the whole lifecycle; each
        // Radar column reconciles only the rows for its own stage. If the
        // payload doesn't carry stages, fall back to applying it to every
        // column (legacy behavior).
        const hasStage = msg.data.every((row) => row.stage != null);
        RADAR_COLUMNS.forEach((column) => {
          const rows = hasStage
            ? msg.data.filter((row) => row.stage === RADAR_STAGES[column])
            : msg.data;
          queryClient.setQueryData(
            ["market", "radar", column],
            (oldData: TokenDetail[] | undefined) =>
              reconcileTrenches(oldData, rows),
          );
        });
      },
    });

    const launchesSub = subscribe({
      payload: { channel: "launches" },
      onMessage() {
        scheduleFreshRefresh();
      },
    });

    return () => {
      trendingSub();
      surgeSub();
      trenchesSub();
      launchesSub();
    };
  }, [subscribe]);
};

export const useTokenWebSocket = (mint: string) => {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    if (!mint) return;

    const tradesSub = subscribe<TradeRow>({
      payload: { channel: "trades", key: mint },
      onMessage(msg) {
        const row: TradeRow = {
          wallet: msg.data.wallet,
          side: msg.data.side,
          sol_amount: msg.data.sol_amount,
          token_amount: BigInt(msg.data.token_amount),
          price_usd: msg.data.price_usd,
          block_time:
            typeof msg.data.block_time === "number"
              ? msg.data.block_time
              : new Date(msg.data.block_time).getTime(),
        };
        queryClient.setQueryData(
          ["token", mint, "trades"],
          (oldData: TradeRow[] | undefined) =>
            produce(oldData ?? [], (draft) => {
              draft.unshift(row);
              if (draft.length > MAX_LIVE_TRADES) {
                draft.length = MAX_LIVE_TRADES;
              }
            }),
        );
      },
    });

    const bondingSub = subscribe<Partial<BondingView>>({
      payload: { channel: "bonding", key: mint },
      onMessage(msg) {
        updateToken(mint, (draft) => {
          draft.bonding = { ...draft.bonding, ...msg.data };
        });
      },
    });

    const holdersSub = subscribe<Partial<HolderSnapshotRow>>({
      payload: { channel: "holders", key: mint },
      onMessage(msg) {
        updateToken(mint, (draft) => {
          const holders = draft.holders ?? ({} as HolderSnapshotRow);
          holders.holder_count = msg.data.holder_count ?? holders.holder_count;
          holders.top10_holder_pct =
            msg.data.top10_holder_pct ?? holders.top10_holder_pct;
          holders.dev_balance = msg.data.dev_balance ?? holders.dev_balance;
          holders.dev_holder_pct =
            msg.data.dev_holder_pct ?? holders.dev_holder_pct;
          draft.holders = holders;
        });
      },
    });

    return () => {
      tradesSub();
      bondingSub();
      holdersSub();
    };
  }, [mint, subscribe]);
};
