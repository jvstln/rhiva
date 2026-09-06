import type {
  TokenFull,
  WsGraduatingEvent,
  BaseWsGraduatingEvent,
} from "@rhivadotfun/dataapi";

import { type AddToTop, type State, lazyFetchToken } from "./utils";
import { createScreener, createTokenFull } from "../defaults/token";

export const onGraduating = <T extends State>(
  state: T,
  event: WsGraduatingEvent,
  addToTop?: AddToTop<T>,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];

  const updateToken = (event: BaseWsGraduatingEvent) => {
    const index = tokens.findIndex((token) => token.mint === event.mint);

    if (index > -1) {
      const current = tokens[index];
      const token: TokenFull = {
        ...current,
        name: event.name ? event.name : current.name,
        symbol: event.symbol ? event.symbol : current.symbol,
        launchpad: event.launchpad ? event.launchpad : current.launchpad,
        price_usd: event.price_usd ? event.price_usd : current.price_usd,
        created_time: event.created_time
          ? event.created_time
          : current.created_time,
        screener: createScreener({
          ...current.screener,
          bonding_pct: event.progress_pct,
          launchpad: event.launchpad || current.screener?.launchpad,
        }),
      };

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
          created_time: event.created_time,
          screener: createScreener({
            bonding_pct: event.progress_pct,
            launchpad: event.launchpad,
          }),
        });

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
