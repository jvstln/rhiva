import type { Window, TokenFull, WsCandleEvent } from "@rhivadotfun/dataapi";

import type { State } from "./utils";

export const onCandle = <T extends State>(state: T, event: WsCandleEvent) => {
  if (state.tokens) {
    const index = state.tokens.findIndex((token) => token.mint === event.mint);
    if (index > -1) {
      const current = state.tokens[index];
      const token: TokenFull = {
        ...current,
        price_usd: event.close ? event.close : current.price_usd,
      };

      if (token.stats) {
        token.stats = { ...token.stats };
        const stat60 = token.stats["60"];
        if (stat60) {
          token.stats["60"] = {
            ...stat60,
            close: event.close,
            trades: stat60.trades + event.trades,
            high: Math.max(stat60.high, event.high),
            open: stat60.open ? stat60.open : event.open,
            volume_usd: stat60.volume_usd + event.volume,
            low: stat60.low === 0 ? event.low : Math.min(stat60.low, event.low),
          };
        }

        for (const [key, value] of Object.entries(token.stats)) {
          const window = key as Window;
          if (window !== "60" && value) {
            token.stats[window] = {
              ...value,
              close: event.close,
              trades: value.trades + event.trades,
              volume_usd: value.volume_usd + event.volume,
              high: Math.max(value.high, event.high),
              low: value.low === 0 ? event.low : Math.min(value.low, event.low),
            };
          }
        }
      }

      const tokens = [...state.tokens];
      tokens[index] = token;
      return { tokens };
    }
  }

  return state;
};
