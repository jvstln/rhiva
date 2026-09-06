import type { TokenFull, WsTransferEvent } from "@rhivadotfun/dataapi";

import type { State } from "./utils";

export const onTransfer = <T extends State>(
  state: T,
  event: WsTransferEvent,
) => {
  if (state.tokens) {
    const index = state.tokens.findIndex((token) => token.mint === event.mint);
    if (index > -1) {
      const current = state.tokens[index];
      if (!current.decimals && event.decimals) {
        const token: TokenFull = {
          ...current,
          decimals: event.decimals,
        };
        const tokens = [...state.tokens];
        tokens[index] = token;
        return { tokens };
      }
    }
  }

  return state;
};
