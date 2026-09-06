import type { TokenFull, WsMetadataEvent } from "@rhivadotfun/dataapi";
import { _metadataCache } from "@/cache";

import type { State } from "./utils";

export const applyMetadataToToken = (
  current: TokenFull,
  event: WsMetadataEvent,
): TokenFull => {
  const x = event.socials.x ? event.socials.x : current.socials.x;
  const telegram = event.socials.telegram
    ? event.socials.telegram
    : current.socials.telegram;
  const website = event.socials.website
    ? event.socials.website
    : current.socials.website;

  return {
    ...current,
    uri: event.uri ? event.uri : current.uri,
    name: event.name ? event.name : current.name,
    symbol: event.symbol ? event.symbol : current.symbol,
    image: event.logo_uri ? event.logo_uri : current.image,
    decimals: event.decimals ? event.decimals : current.decimals,
    socials: {
      ...current.socials,
      x,
      website,
      telegram,
    },
    screener: current.screener
      ? {
          ...current.screener,
          socials: {
            ...current.screener.socials,
            x: Boolean(x),
            website: Boolean(website),
            telegram: Boolean(telegram),
            any: Boolean(website || x || telegram),
          },
        }
      : null,
  };
};

export const onMetadata = <T extends State>(
  state: T,
  event: WsMetadataEvent,
) => {
  _metadataCache.set(event.mint, event);
  if (state.tokens) {
    const index = state.tokens.findIndex((token) => token.mint === event.mint);
    if (index > -1) {
      const tokens = [...state.tokens];
      tokens[index] = applyMetadataToToken(tokens[index], event);
      return { tokens };
    }
  }

  return state;
};
