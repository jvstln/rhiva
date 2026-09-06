import type { TokenFull, WsTokenCreateEvent } from "@rhivadotfun/dataapi";

import { _metadataCache } from "@/cache";
import { createTokenFull } from "../defaults/token";
import type { State, AddToTop } from "./utils";

export const onTokenCreate = <T extends State>(
  state: T,
  event: WsTokenCreateEvent,
  addToTop?: AddToTop<T> | boolean,
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
    return { ...state, tokens };
  } else if (addToTop) {
    const cachedMeta = _metadataCache.get(event.mint);
    const token = createTokenFull({
      uri: event.uri || cachedMeta?.uri || null,
      name: event.name || cachedMeta?.name || "",
      mint: event.mint,
      symbol: event.symbol || cachedMeta?.symbol || "",
      image: cachedMeta?.logo_uri || null,
      creator: event.creator,
      created_time: event.block_time,
      created_slot: event.slot,
    });

    tokens.unshift(token);
    return { ...state, tokens };
  }

  return state;
};
