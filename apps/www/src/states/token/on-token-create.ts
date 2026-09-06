import type { TokenFull, WsTokenCreateEvent } from "@rhivadotfun/dataapi";

import { createTokenFull } from "../defaults/token";
import { type State, type AddToTop, lazyFetchToken } from "./utils";

export const onTokenCreate = <T extends State>(
  state: T,
  event: WsTokenCreateEvent,
  addToTop?: AddToTop<T>,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];
  const index = tokens.findIndex((token) => token.mint === event.mint);
  if (index > -1) {
    const current = tokens[index];
    const token: TokenFull = {
      ...current,
      uri: event.uri ? event.uri : current.uri,
      name: event.name ? event.name : current.name,
      symbol: event.symbol ? event.symbol : current.symbol,
      creator: event.creator ? event.creator : current.creator,
      created_time: event.block_time ? event.block_time : current.created_time,
      created_slot: event.slot ? event.slot : current.created_slot,
    };

    tokens[index] = token;
    return { tokens };
  } else {
    if (addToTop) {
      const token = createTokenFull({
        uri: event.uri,
        name: event.name,
        mint: event.mint,
        symbol: event.symbol,
        creator: event.creator,
        created_time: event.block_time,
        created_slot: event.slot,
      });

      lazyFetchToken(event.mint, addToTop);

      tokens.unshift(token);
      return { tokens };
    }
  }

  return state;
};
