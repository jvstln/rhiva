import type { TokenFull, WsGraduationEvent } from "@rhivadotfun/dataapi";

import { type AddToTop, type State, lazyFetchToken } from "./utils";
import { createPool, createScreener, createTokenFull } from "../defaults/token";

export const onGraduation = <T extends State>(
  state: T,
  event: WsGraduationEvent,
  addToTop?: AddToTop<T>,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];
  const index = tokens.findIndex((token) => token.mint === event.mint);

  if (index > -1) {
    const current = tokens[index];
    const token: TokenFull = {
      ...current,
      creator: current.creator ? current.creator : event.creator,
      launchpad: current.launchpad ? current.launchpad : event.launchpad,
      created_time: current.created_time
        ? current.created_time
        : event.created_time,
      screener: createScreener({
        ...current.screener,
        is_graduated: true,
        bonding_pct: 100,
        launchpad: current.screener?.launchpad
          ? current.screener.launchpad
          : event.launchpad,
      }),
    };

    if (event.pool && !token.pools.some((pool) => pool.pool === event.pool)) {
      token.pools = [
        ...token.pools,
        createPool({
          pool: event.pool,
          dex: event.dex,
          price_usd: token.price_usd,
          quote_mint: token.quote_mint,
          liquidity_usd: token.liquidity_usd,
          created_time: event.block_time
            ? event.block_time
            : event.created_time,
        }),
      ];
    }

    tokens[index] = token;
    return { tokens };
  } else {
    if (addToTop) {
      const token = createTokenFull({
        mint: event.mint,
        launchpad: event.launchpad,
        creator: event.creator,
        created_time: event.created_time,
        screener: createScreener({
          is_graduated: true,
          bonding_pct: 100,
          launchpad: event.launchpad,
        }),
      });

      lazyFetchToken(event.mint, addToTop);

      tokens.unshift(token);
      return { tokens };
    }
  }

  return state;
};
