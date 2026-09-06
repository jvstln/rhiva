import { queryClient } from "@/lib";
import { dataapi } from "@/lib/dataapi";
import type { TokenFull, TokenTrade } from "@rhivadotfun/dataapi";
import { produce } from "immer";
import { useEffect } from "react";
import {
  useFresh,
  useGraduated,
  useHeatingUp,
  useLatest,
  useStableCoin,
  useStock,
  useSurge,
  useTopGainer,
  useTrending,
  useWatchList,
} from "@/states";
import stocks from "../../../stocks.json";
import stablecoins from "../../../stablecoins.json";

const MAX_LIVE_TRADES = 100;

const registerSubscription = (
  promise: Promise<() => void>,
  unsubscribers: (() => void)[],
  isCancelled: () => boolean,
) => {
  promise
    .then((unsub) => {
      if (isCancelled()) {
        unsub();
      } else {
        unsubscribers.push(unsub);
      }
    })
    .catch((err) => {
      console.warn("[WS Subscription Error]", err);
    });
};

/** Patch a single token in the cache `useToken(mint)` reads. */
const updateToken = (mint: string, apply: (draft: TokenFull) => void) => {
  queryClient.setQueryData(["token", mint], (oldData: TokenFull | undefined) =>
    oldData ? produce(oldData, apply) : oldData,
  );
};

/* ------------------------------------------------------------------ */
/* Per-view WebSocket Registration Hooks                              */
/* ------------------------------------------------------------------ */

export const useTrendingWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "graduation",
            "graduated",
            "graduating",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "surge",
            "radar",
            "meme",
            "token_create",
            "launches",
            "token_update",
            "movers",
          ],
        },
        (event) => useTrending.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useSurgeWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "graduation",
            "graduated",
            "graduating",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "surge",
            "radar",
            "meme",
            "token_create",
            "launches",
            "movers",
          ],
        },
        (event) => useSurge.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useLatestWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "graduation",
            "graduated",
            "graduating",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "surge",
            "radar",
            "meme",
            "token_create",
            "launches",
            "movers",
          ],
        },
        (event) => useLatest.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useTopGainersWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "graduation",
            "graduated",
            "graduating",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "surge",
            "radar",
            "meme",
            "token_create",
            "movers",
          ],
        },
        (event) => useTopGainer.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useStockWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled || !stocks.length) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "surge",
            "radar",
            "launches",
          ],
          address: stocks,
        },
        (event) => useStock.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useStablecoinWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled || !stablecoins.length) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "launches",
          ],
          address: stablecoins,
        },
        (event) => useStableCoin.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useWatchlistWebSocket = (
  mints: string[],
  { enabled = true }: { enabled?: boolean } = {},
) => {
  useEffect(() => {
    if (!enabled || !mints.length) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "graduation",
            "graduated",
            "graduating",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "radar",
            "surge",
            "meme",
            "token_create",
          ],
          address: mints,
        },
        (event) => useWatchList.getState().onWsEvent(event),
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled, mints]);
};

export const useRadarWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const unsubs: (() => void)[] = [];
    const reg = (p: Promise<() => void>) =>
      registerSubscription(p, unsubs, () => cancelled);

    reg(
      dataapi.ws.subscribe(
        {
          type: [
            "metadata",
            "graduation",
            "graduated",
            "graduating",
            "liquidity",
            "stats",
            "swap",
            "pool_create",
            "radar",
            "surge",
            "meme",
            "token_create",
            "launches",
            "token_update",
            "movers",
          ],
        },
        (event) => {
          useFresh.getState().onWsEvent(event);
          useHeatingUp.getState().onWsEvent(event);
          useGraduated.getState().onWsEvent(event);
        },
      ),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

/* ------------------------------------------------------------------ */
/* Token Detail WebSocket Hook                                        */
/* ------------------------------------------------------------------ */

export const useTokenWebSocket = (mint: string) => {
  useEffect(() => {
    if (!mint) return;
    let unmounted = false;
    const unsubscribers: (() => void)[] = [];

    const register = (promise: Promise<() => void>) => {
      promise
        .then((unsub) => {
          if (unmounted) {
            unsub();
          } else {
            unsubscribers.push(unsub);
          }
        })
        .catch((err) => {
          console.warn("[Token WS Error]", err);
        });
    };

    // Live trades and meme stats for this token
    register(
      dataapi.ws.subscribe(
        { type: ["swap", "meme"], address: [mint] },
        (event) => {
          if (event.type === "swap") {
            const row: TokenTrade = {
              signature: event.signature,
              slot: event.slot,
              block_time: event.block_time,
              tx_index: event.tx_index,
              ix_index: event.ix_index,
              dex: event.dex,
              pool: event.pool,
              side: event.side,
              trader: event.trader,
              price: event.price,
              price_usd: event.price_usd,
              volume_usd: event.volume_usd,
              base_amount: event.base_amount,
              quote_amount: event.quote_amount,
              base_decimals: event.base_decimals,
              quote_decimals: event.quote_decimals,
              base_reserve: event.base_reserve,
              quote_reserve: event.quote_reserve,
              fee_amount: event.fee_amount,
              fee_mint: event.fee_mint,
              fee_pct: event.fee_pct,
              price_impact_pct: event.price_impact_pct,
            };

            queryClient.setQueryData(
              ["token", mint, "trades"],
              (oldData: TokenTrade[] | undefined) => {
                const existing = oldData ?? [];
                if (existing.some((t) => t.signature === row.signature)) {
                  return existing;
                }
                return [row, ...existing].slice(0, MAX_LIVE_TRADES);
              },
            );

            updateToken(mint, (draft) => {
              draft.price_usd = event.price_usd;
            });
          } else if (event.type === "meme") {
            updateToken(mint, (draft) => {
              draft.price_usd = event.price_usd;
              if (draft.screener) {
                draft.screener.bonding_pct = event.progress_pct;
              }
            });
          }
        },
      ),
    );

    return () => {
      unmounted = true;
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }, [mint]);
};
