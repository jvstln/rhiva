import type { Window, TokenFull, WsStatsEvent } from "@rhivadotfun/dataapi";

import type { State } from "./utils";
import { createDefaultStatsWindow } from "../defaults/token";

export const onStats = <T extends State>(state: T, event: WsStatsEvent) => {
  if (state.tokens) {
    const index = state.tokens.findIndex((token) => token.mint === event.mint);

    if (index > -1) {
      const current = state.tokens[index];
      const price_usd = event.price_usd ? event.price_usd : current.price_usd;
      const market_cap_usd =
        current.supply && price_usd
          ? current.supply * price_usd
          : current.market_cap_usd;
      const token: TokenFull = {
        ...current,
        price_usd,
        market_cap_usd,
        fdv_usd: market_cap_usd,
      };

      if (event.windows) {
        token.stats = { ...token.stats };
        for (const [key, value] of Object.entries(event.windows)) {
          const statsKey = key as Window;
          const updates = {
            trades: value.trades,
            buys: value.buys,
            sells: value.sells,
            volume_usd: value.volume_usd,
            price_change_pct: value.price_change_pct,
          };

          if (value && token.stats[statsKey]) {
            token.stats[statsKey] = {
              ...token.stats[statsKey],
              ...updates,
            };
          } else token.stats[statsKey] = createDefaultStatsWindow(updates);
        }
      }

      const tokens = [...state.tokens];
      tokens[index] = token;
      return { tokens };
    }
  }
  return state;
};
