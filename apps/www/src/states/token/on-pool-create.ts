import type { TokenFull, WsPoolCreateEvent } from "@rhivadotfun/dataapi";

import type { State } from "./utils";
import { createPool } from "../defaults/token";

export const onPoolCreate = <T extends State>(
  state: T,
  event: WsPoolCreateEvent,
) => {
  if (state.tokens) {
    const index = state.tokens.findIndex((token) => token.mint === event.mint);
    if (index > -1) {
      const current = state.tokens[index];
      const token: TokenFull = {
        ...current,
        uri: current.uri ? current.uri : event.uri,
        name: current.name ? current.name : event.name,
        symbol: current.symbol ? current.symbol : event.symbol,
        creator: current.creator ? current.creator : event.creator,
      };

      const pools = token.pools ? [...token.pools] : [];
      if (!pools.some((pool) => pool.pool === event.pool)) {
        token.pools = [
          ...pools,
          createPool({
            pool: event.pool,
            dex: event.dex,
            quote_mint: event.quote_mint,
            price_usd: token.price_usd,
            liquidity_usd: token.liquidity_usd,
            created_time: event.block_time,
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
