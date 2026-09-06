import type { TokenFull, TokenTrending } from "@rhivadotfun/dataapi";

import { createTokenFull } from "../defaults/token";
import type { State, AddToTop } from "./utils";

export const onTrending = <T extends State>(
  state: T,
  event: TokenTrending | (Partial<TokenFull> & { mint: string }),
  addToTop?: AddToTop<T>,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];
  const index = tokens.findIndex((token) => token.mint === event.mint);

  if (index > -1) {
    const current = tokens[index];
    const token: TokenFull = {
      ...current,
      name: event.name || current.name,
      symbol: event.symbol || current.symbol,
      price_usd: event.price_usd ? event.price_usd : current.price_usd,
      market_cap_usd: event.market_cap_usd
        ? event.market_cap_usd
        : current.market_cap_usd,
      liquidity_usd: event.liquidity_usd
        ? event.liquidity_usd
        : current.liquidity_usd,
      image: "image" in event && event.image ? event.image : current.image,
    };

    tokens[index] = token;
    return { tokens };
  } else {
    if (addToTop) {
      const token = createTokenFull({
        mint: event.mint,
        name: event.name,
        symbol: event.symbol,
        price_usd: event.price_usd,
        market_cap_usd: event.market_cap_usd,
        liquidity_usd: event.liquidity_usd,
        image: "image" in event && event.image ? event.image : null,
      });

      tokens.unshift(token);
      return { tokens };
    }
  }

  return state;
};
