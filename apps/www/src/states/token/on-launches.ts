import type {
  TokenFull,
  WsLaunchEvent,
  BaseWsLaunchEvent,
} from "@rhivadotfun/dataapi";

import { type State, insertOrMoveByRank } from "./utils";
import { createScreener, createTokenFull } from "../defaults/token";

export const onLaunches = <T extends State>(state: T, event: WsLaunchEvent) => {
  let tokens = state.tokens ? [...state.tokens] : [];

  const updateToken = (row: BaseWsLaunchEvent, rank?: number) => {
    const index = tokens.findIndex((token) => token.mint === row.mint);

    if (index > -1) {
      const current = tokens[index];
      const token: TokenFull = {
        ...current,
        name: row.name ? row.name : current.name,
        symbol: row.symbol ? row.symbol : current.symbol,
        launchpad: row.launchpad ? row.launchpad : current.launchpad,
        created_time: row.block_time ? row.block_time : current.created_time,
        screener: createScreener({
          ...current.screener,
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
      // Token doesn't exist yet: create immediately so as to make real-time
      const token = createTokenFull({
        mint: row.mint,
        name: row.name,
        symbol: row.symbol,
        launchpad: row.launchpad,
        created_time: row.block_time,
        screener: createScreener({
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
