import type { TokenFull, WsGraduationEvent } from "@rhivadotfun/dataapi";

import { _metadataCache } from "@/cache";
import type { AddToTop, State } from "./utils";
import { createPool, createScreener, createTokenFull } from "../defaults/token";

export const onGraduation = <T extends State>(
  state: T,
  event: WsGraduationEvent,
  addToTop?: AddToTop<T> | boolean,
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
    return { ...state, tokens };
  } else if (addToTop) {
    const cachedMeta = _metadataCache.get(event.mint);
    const token = createTokenFull({
      mint: event.mint,
      name: cachedMeta?.name || "",
      symbol: cachedMeta?.symbol || "",
      image: cachedMeta?.logo_uri || null,
      launchpad: event.launchpad,
      creator: event.creator,
      created_time: event.created_time,
      screener: createScreener({
        is_graduated: true,
        bonding_pct: 100,
        launchpad: event.launchpad,
      }),
    });

    tokens.unshift(token);
    return { ...state, tokens };
  }

  return state;
};
