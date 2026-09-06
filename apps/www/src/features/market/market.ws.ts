import { queryClient } from "@/lib";
import { dataapi } from "@/lib/dataapi";
import type { TokenFull, TokenTrade } from "@rhivadotfun/dataapi";
import { produce } from "immer";
import { useEffect } from "react";
import { _metadataCache } from "@/cache";
import { applyMetadataToToken } from "@/states/token/on-metadata";
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

const MAX_LIVE_TRADES = 25;

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
/* Per-view Dedicated WebSocket Hooks (Single event, unsubs on leave) */
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
      dataapi.ws.subscribe({ type: "movers" }, (event) => {
        useTrending.getState().onWsEvent(event);
      }),
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
      dataapi.ws.subscribe({ type: ["surge", "movers"] }, (event) => {
        useSurge.getState().onWsEvent(event);
      }),
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
      dataapi.ws.subscribe({ type: "launches" }, (event) => {
        useLatest.getState().onWsEvent(event);
      }),
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
      dataapi.ws.subscribe({ type: "movers" }, (event) => {
        useTopGainer.getState().onWsEvent(event);
      }),
    );

    return () => {
      cancelled = true;
      for (const unsub of unsubs) unsub();
    };
  }, [enabled]);
};

export const useStockWebSocket = ({
  enabled: _enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  // Stock state is kept real-time via useGlobalMarketWebSocket
};

export const useStablecoinWebSocket = ({
  enabled: _enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  // Stablecoin state is kept real-time via useGlobalMarketWebSocket
};

export const useWatchlistWebSocket = (
  _mints: string[],
  { enabled: _enabled = true }: { enabled?: boolean } = {},
) => {
  // Watchlist state is kept real-time via useGlobalMarketWebSocket
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
            "graduation",
            "graduated",
            "graduating",
            "radar",
            "movers",
            "launches",
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
                const index = existing.findIndex(
                  (t) => t.signature === row.signature,
                );
                if (index !== -1) {
                  const updated = [...existing];
                  updated[index] = row;
                  return updated.slice(0, MAX_LIVE_TRADES);
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

/* ------------------------------------------------------------------ */
/* Global Metadata WebSocket Hook                                      */
/* ------------------------------------------------------------------ */

export const useGlobalMetadataWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let unsubscriber: (() => void) | null = null;

    dataapi.ws
      .subscribe({ type: "metadata" }, (event) => {
        if (cancelled || event.type !== "metadata") return;

        // Always cache metadata for later use by meme and co.
        _metadataCache.set(event.mint, event);

        // Update all states that require metadata if the token exists in that state
        const stores = [
          useTrending,
          useSurge,
          useLatest,
          useTopGainer,
          useStock,
          useStableCoin,
          useFresh,
          useHeatingUp,
          useGraduated,
          useWatchList,
        ];

        for (const store of stores) {
          const tokens = store.getState().tokens;
          if (tokens?.some((t) => t.mint === event.mint)) {
            const current = tokens.find((t) => t.mint === event.mint);
            if (current) {
              const updated = applyMetadataToToken(current, event);
              store.getState().updateToken(updated);
            }
          }
        }

        // Also update token cache in React Query if active
        queryClient.setQueryData(
          ["token", event.mint],
          (old: TokenFull | undefined) =>
            old ? applyMetadataToToken(old, event) : old,
        );
      })
      .then((unsub) => {
        if (cancelled) {
          unsub();
        } else {
          unsubscriber = unsub;
        }
      })
      .catch((err) => {
        console.warn("[Global Metadata WS Error]", err);
      });

    return () => {
      cancelled = true;
      if (unsubscriber) unsubscriber();
    };
  }, [enabled]);
};

/* ------------------------------------------------------------------ */
/* Global Market Events WebSocket Hook                                */
/* Groups common high-throughput events and dispatches to all states  */
/* ------------------------------------------------------------------ */

export const useGlobalMarketWebSocket = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let unsubscriber: (() => void) | null = null;

    dataapi.ws
      .subscribe(
        {
          type: [
            "swap",
            "liquidity",
            "stats",
            "pool_create",
            "token_create",
            "token_update",
            "meme",
          ],
        },
        (event) => {
          if (cancelled) return;

          // Dispatch high-throughput grouped events to all token states
          useTrending.getState().onWsEvent(event);
          useSurge.getState().onWsEvent(event);
          useLatest.getState().onWsEvent(event);
          useTopGainer.getState().onWsEvent(event);
          useFresh.getState().onWsEvent(event);
          useHeatingUp.getState().onWsEvent(event);
          useGraduated.getState().onWsEvent(event);
          useStock.getState().onWsEvent(event);
          useStableCoin.getState().onWsEvent(event);
          useWatchList.getState().onWsEvent(event);

          if ("mint" in event && event.mint) {
            if (event.type === "swap") {
              updateToken(event.mint, (draft) => {
                draft.price_usd = event.price_usd;
              });
            } else if (event.type === "meme") {
              updateToken(event.mint, (draft) => {
                draft.price_usd = event.price_usd;
                if (draft.screener) {
                  draft.screener.bonding_pct = event.progress_pct;
                }
              });
            } else if (event.type === "token_update") {
              updateToken(event.mint, (draft) => {
                draft.price_usd = event.price_usd;
                if (event.mcap_usd) draft.market_cap_usd = event.mcap_usd;
                if (event.liquidity_usd)
                  draft.liquidity_usd = event.liquidity_usd;
              });
            }
          }
        },
      )
      .then((unsub) => {
        if (cancelled) {
          unsub();
        } else {
          unsubscriber = unsub;
        }
      })
      .catch((err) => {
        console.warn("[Global Market WS Error]", err);
      });

    return () => {
      cancelled = true;
      if (unsubscriber) unsubscriber();
    };
  }, [enabled]);
};
