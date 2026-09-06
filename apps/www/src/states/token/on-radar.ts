import type { TokenFull, WsRadarEvent } from "@rhivadotfun/dataapi";

import { createTokenFull } from "../defaults/token";
import type { State, AddToTop } from "./utils";

export const onRadar = <T extends State>(
  state: T,
  event: WsRadarEvent,
  addToTop?: AddToTop<T>,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];
  const index = tokens.findIndex((token) => token.mint === event.mint);

  if (index > -1) {
    const current = tokens[index];
    const price_usd = event.price_at_trigger
      ? event.price_at_trigger
      : current.price_usd;
    const market_cap_usd = event.mcap_at_trigger
      ? event.mcap_at_trigger
      : current.market_cap_usd;

    const token: TokenFull = {
      ...current,
      price_usd,
      market_cap_usd,
      fdv_usd: market_cap_usd ? market_cap_usd : current.fdv_usd,
    };

    tokens[index] = token;
    return { tokens };
  } else {
    if (addToTop) {
      const token = createTokenFull({
        mint: event.mint,
        price_usd: event.price_at_trigger,
        market_cap_usd: event.mcap_at_trigger,
        fdv_usd: event.mcap_at_trigger,
      });

      tokens.unshift(token);
      return { tokens };
    }
  }

  return state;
};
