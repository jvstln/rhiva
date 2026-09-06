import type { Window, TokenFull, WsSwapEvent } from "@rhivadotfun/dataapi";

import type { State } from "./utils";
import { createPool, createDefaultStatsWindow } from "../defaults/token";

export const onSwap = <T extends State>(state: T, event: WsSwapEvent) => {
  if (state.tokens) {
    const index = state.tokens.findIndex((token) => token.mint === event.mint);
    if (index > -1) {
      const current = state.tokens[index];
      const price_usd = event.price_usd;
      const market_cap_usd = current.supply
        ? current.supply * price_usd
        : current.market_cap_usd;
      const token: TokenFull = {
        ...current,
        price_usd,
        market_cap_usd,
        fdv_usd: market_cap_usd,
        price_native: event.price,
        quote_mint: event.quote_mint ? event.quote_mint : current.quote_mint,
      };

      if (token.screener) {
        const delta =
          event.side === "buy" ? event.volume_usd : -event.volume_usd;
        token.screener = {
          ...token.screener,
          fees_usd: token.screener.fees_usd + (event.fee_amount || 0),
          net_buy_usd: token.screener.net_buy_usd + delta,
        };
      }

      token.stats = { ...token.stats };
      for (const [key, value] of Object.entries(token.stats)) {
        const statsKey = key as Window;

        if (value) {
          const stat = token.stats[statsKey]
            ? token.stats[statsKey]
            : createDefaultStatsWindow();
          token.stats[statsKey] = {
            ...stat,
            close: price_usd,
            trades: stat.trades + 1,
            high: Math.max(stat.high, price_usd),
            volume_usd: stat.volume_usd + event.volume_usd,
            buys: stat.buys + (event.side === "buy" ? 1 : 0),
            sells: stat.sells + (event.side === "sell" ? 1 : 0),
            low: stat.low === 0 ? price_usd : Math.min(stat.low, price_usd),
          };
        }
      }

      let mutated = false;
      token.pools = (token.pools || []).map((pool) => {
        if (pool.pool === event.pool) {
          mutated = true;
          return {
            ...pool,
            trades: pool.trades + 1,
            price_usd: event.price_usd,
            base_reserve: event.base_reserve,
            quote_reserve: event.quote_reserve,
            volume_usd: pool.volume_usd + event.volume_usd,
            virtual_base_reserve: event.virtual_base_reserve,
            virtual_quote_reserve: event.virtual_quote_reserve,
          };
        }

        return pool;
      });

      if (!mutated && event.pool) {
        token.pools = [
          ...token.pools,
          createPool({
            trades: 1,
            pool: event.pool,
            dex: event.dex,
            quote_mint: event.quote_mint,
            price_usd: event.price_usd,
            volume_usd: event.volume_usd,
            base_reserve: event.base_reserve,
            quote_reserve: event.quote_reserve,
            virtual_base_reserve: event.virtual_base_reserve,
            virtual_quote_reserve: event.virtual_quote_reserve,
          }),
        ];
      }

      const tokens = [...state.tokens];
      tokens[index] = token;
      return { tokens };
    }
  }
  return state;
};
