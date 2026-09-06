import type {
  TokenFull,
  WsGraduatingEvent,
  BaseWsGraduatingEvent,
} from "@rhivadotfun/dataapi";

import { type State, insertOrMoveByRank } from "./utils";
import { createScreener, createTokenFull } from "../defaults/token";

export const onGraduating = <T extends State>(
  state: T,
  event: WsGraduatingEvent,
) => {
  let tokens = state.tokens ? [...state.tokens] : [];

  const updateToken = (row: BaseWsGraduatingEvent, rank?: number) => {
    const index = tokens.findIndex((token) => token.mint === row.mint);

    if (index > -1) {
      const current = tokens[index];
      const token: TokenFull = {
        ...current,
        name: row.name ? row.name : current.name,
        symbol: row.symbol ? row.symbol : current.symbol,
        launchpad: row.launchpad ? row.launchpad : current.launchpad,
        price_usd: row.price_usd ? row.price_usd : current.price_usd,
        created_time: row.created_time
          ? row.created_time
          : current.created_time,
        screener: createScreener({
          ...current.screener,
          bonding_pct: row.progress_pct,
          launchpad: row.launchpad || current.screener?.launchpad,
        }),
      };

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
        created_time: row.created_time,
        screener: createScreener({
          bonding_pct: row.progress_pct,
          launchpad: row.launchpad,
        }),
      });

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
