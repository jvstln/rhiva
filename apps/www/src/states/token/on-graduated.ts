import type {
  BaseWsGraduatedEvent,
  TokenFull,
  WsGraduatedEvent,
} from "@rhivadotfun/dataapi";

import { type State, insertOrMoveByRank } from "./utils";
import { createPool, createScreener, createTokenFull } from "../defaults/token";

export const onGraduated = <T extends State>(
  state: T,
  event: WsGraduatedEvent,
) => {
  let tokens = state.tokens ? [...state.tokens] : [];

  const updateToken = (row: BaseWsGraduatedEvent, rank?: number) => {
    const index = tokens.findIndex((token) => token.mint === row.mint);

    if (index > -1) {
      const current = tokens[index];
      const token: TokenFull = {
        ...current,
        name: row.name ? row.name : current.name,
        symbol: row.symbol ? row.symbol : current.symbol,
        launchpad: row.launchpad ? row.launchpad : current.launchpad,
        price_usd: row.price_usd ? row.price_usd : current.price_usd,
        liquidity_usd: row.liquidity_usd
          ? row.liquidity_usd
          : current.liquidity_usd,
        screener: createScreener({
          ...current.screener,
          is_graduated: true,
          bonding_pct: 100,
          launchpad: row.launchpad || current.screener?.launchpad,
        }),
      };

      if (row.pool && !token.pools.some((pool) => pool.pool === row.pool)) {
        token.pools = [
          ...token.pools,
          createPool({
            pool: row.pool,
            dex: row.dex,
            price_usd: row.price_usd,
            quote_mint: token.quote_mint,
            liquidity_usd: row.liquidity_usd,
            created_time: row.graduated_time,
          }),
        ];
      }

      tokens = insertOrMoveByRank(
        tokens,
        token,
        rank,
        (t) => t.mint === row.mint,
      );
    } else {
      // Create token even if it doesn't exist yet to make list real-time
      const token = createTokenFull({
        mint: row.mint,
        name: row.name,
        symbol: row.symbol,
        launchpad: row.launchpad,
        price_usd: row.price_usd,
        liquidity_usd: row.liquidity_usd,
        created_time: row.graduated_time,
        screener: createScreener({
          is_graduated: true,
          bonding_pct: 100,
          launchpad: row.launchpad,
        }),
      });

      if (row.pool) {
        token.pools = [
          createPool({
            pool: row.pool,
            dex: row.dex,
            price_usd: row.price_usd,
            quote_mint: token.quote_mint,
            liquidity_usd: row.liquidity_usd,
            created_time: row.graduated_time,
          }),
        ];
      }

      tokens = insertOrMoveByRank(
        tokens,
        token,
        rank,
        (t) => t.mint === row.mint,
      );
    }
  };

  if (event.event === "snapshot") {
    for (let i = 0; i < event.rows.length; i++) {
      updateToken(event.rows[i], i + 1);
    }
    return { ...state, tokens };
  } else {
    updateToken(event, event.rank);
    return { ...state, tokens };
  }
};
