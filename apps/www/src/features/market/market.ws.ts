import { queryClient } from "@/lib";
import { dataapi } from "@/lib/dataapi";
import type { TokenFull, TokenTrade } from "@rhivadotfun/dataapi";
import { produce } from "immer";
import { useEffect } from "react";

const MAX_LIVE_TRADES = 100;

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
const updateToken = (mint: string, apply: (draft: TokenFull) => void) => {
  queryClient.setQueryData(["token", mint], (oldData: TokenFull | undefined) =>
    oldData ? produce(oldData, apply) : oldData,
  );
};

export const useMarketWebsocket = () => {
  useEffect(() => {
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
          console.warn("[Market WS Error]", err);
        });
    };

    // 1. Fresh creations -> Fresh column on Radar
    register(
      dataapi.ws.subscribe({ type: "token_created" }, (event) => {
        if (event.type === "token_create") {
          scheduleFreshRefresh();
        }
      }),
    );

    // 2. Meme updates -> progress_pct & prices in radar
    register(
      dataapi.ws.subscribe({ type: "meme" }, (event) => {
        if (event.type === "meme") {
          queryClient.setQueryData(
            ["market", "radar", "heatingUp"],
            (old: TokenFull[] | undefined) => {
              if (!old) return old;
              return old.map((t) =>
                t.mint === event.mint
                  ? {
                      ...t,
                      price_usd: event.price_usd,
                      screener: t.screener
                        ? {
                            ...t.screener,
                            bonding_pct: event.progress_pct,
                          }
                        : null,
                    }
                  : t,
              );
            },
          );
        }
      }),
    );

    // 3. Graduation events -> refresh graduated column
    register(
      dataapi.ws.subscribe({ type: "graduation" }, (event) => {
        if (event.type === "graduation") {
          queryClient.invalidateQueries({ queryKey: ["market", "radar"] });
        }
      }),
    );

    // 4. Surge events -> refresh surge feed
    register(
      dataapi.ws.subscribe({ type: "surge" }, (event) => {
        if (event.type === "surge") {
          queryClient.invalidateQueries({ queryKey: ["market", "surge"] });
        }
      }),
    );

    // 5. Radar alerts -> refresh radar
    register(
      dataapi.ws.subscribe({ type: "radar" }, (event) => {
        if (event.type === "radar") {
          queryClient.invalidateQueries({ queryKey: ["market", "radar"] });
        }
      }),
    );

    return () => {
      unmounted = true;
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }, []);
};

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

    // Live trades for this token
    register(
      dataapi.ws.subscribe({ type: "swap", address: [mint] }, (event) => {
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
            (oldData: TokenTrade[] | undefined) =>
              produce(oldData ?? [], (draft) => {
                draft.unshift(row);
                if (draft.length > MAX_LIVE_TRADES) {
                  draft.length = MAX_LIVE_TRADES;
                }
              }),
          );

          updateToken(mint, (draft) => {
            draft.price_usd = event.price_usd;
          });
        }
      }),
    );

    // Live meme stats for bonding curve tokens
    register(
      dataapi.ws.subscribe({ type: "meme", address: [mint] }, (event) => {
        if (event.type === "meme") {
          updateToken(mint, (draft) => {
            draft.price_usd = event.price_usd;
            if (draft.screener) {
              draft.screener.bonding_pct = event.progress_pct;
            }
          });
        }
      }),
    );

    return () => {
      unmounted = true;
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }, [mint]);
};
