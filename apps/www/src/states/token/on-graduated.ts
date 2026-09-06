import type {
  BaseWsGraduatedEvent,
  TokenFull,
  WsGraduatedEvent,
} from "@rhivadotfun/dataapi";

import { lazyFetchToken, type AddToTop, type State } from "./utils";
import { createPool, createScreener, createTokenFull } from "../defaults/token";

export const onGraduated = <T extends State>(
  state: T,
  event: WsGraduatedEvent,
  addToTop?: AddToTop<T>,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];

  const updateToken = (event: BaseWsGraduatedEvent) => {
    const index = tokens.findIndex((token) => token.mint === event.mint);

    if (index > -1) {
      const current = tokens[index];
      const token: TokenFull = {
        ...current,
        name: event.name ? event.name : current.name,
        symbol: event.symbol ? event.symbol : current.symbol,
        launchpad: event.launchpad ? event.launchpad : current.launchpad,
        price_usd: event.price_usd ? event.price_usd : current.price_usd,
        liquidity_usd: event.liquidity_usd
          ? event.liquidity_usd
          : current.liquidity_usd,
        screener: createScreener({
          ...current.screener,
          is_graduated: true,
          bonding_pct: 100,
          launchpad: event.launchpad || current.screener?.launchpad,
        }),
      };

      if (event.pool && !token.pools.some((pool) => pool.pool === event.pool)) {
        token.pools = [
          ...token.pools,
          createPool({
            pool: event.pool,
            dex: event.dex,
            price_usd: event.price_usd,
            quote_mint: token.quote_mint,
            liquidity_usd: event.liquidity_usd,
            created_time: event.graduated_time,
          }),
        ];
      }

      tokens[index] = token;
      return { tokens };
    } else {
      if (addToTop) {
        const token = createTokenFull({
          mint: event.mint,
          name: event.name,
          symbol: event.symbol,
          launchpad: event.launchpad,
          price_usd: event.price_usd,
          liquidity_usd: event.liquidity_usd,
          created_time: event.graduated_time,
          screener: createScreener({
            is_graduated: true,
            bonding_pct: 100,
            launchpad: event.launchpad,
          }),
        });

        if (event.pool) {
          token.pools = [
            createPool({
              pool: event.pool,
              dex: event.dex,
              price_usd: event.price_usd,
              quote_mint: token.quote_mint,
              liquidity_usd: event.liquidity_usd,
              created_time: event.graduated_time,
            }),
          ];
        }

        lazyFetchToken(event.mint, addToTop);

        tokens.unshift(token);
        return { tokens };
      }
    }
  };

  if (event.event === "snapshot") {
    for (const row of event.rows) updateToken(row);
    return { tokens };
  } else {
    const state = updateToken(event);
    if (state) return state;
  }

  return state;
};
