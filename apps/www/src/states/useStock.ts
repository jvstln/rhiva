import { create } from "zustand";
import type { TokenFull, WsEvent } from "@rhivadotfun/dataapi";

import {
  onSwap,
  onSurge,
  onRadar,
  onStats,
  onMetadata,
  onLiquidity,
  onPoolCreate,
} from "./token/actions";

type State = {
  tokens: TokenFull[] | null;
};

type Action = {
  setTokens(value: TokenFull[]): void;
  addTokens(...value: TokenFull[]): void;
  removeToken(id: TokenFull["mint"]): void;
  updateToken(value: Partial<TokenFull> & { mint: string }): void;
  onWsEvent: (
    event: Extract<
      WsEvent,
      | { type: "metadata" }
      | { type: "liquidity" }
      | { type: "stats" }
      | { type: "swap" }
      | { type: "pool_create" }
      | { type: "surge" }
      | { type: "radar" }
      | { type: "launches" }
    >,
  ) => void;
};

export const useStock = create<State & Action>((set) => {
  return {
    tokens: null,
    addTokens(...tokens: TokenFull[]) {
      set((state) => ({ tokens: [...state.tokens!, ...tokens] }));
    },
    setTokens(tokens: TokenFull[]) {
      set(() => ({ tokens }));
    },
    removeToken(mint: TokenFull["mint"]) {
      set((state) => {
        if (state.tokens) {
          const tokens = state.tokens.filter((token) => token.mint !== mint);
          return { tokens };
        }
        return state;
      });
    },
    updateToken(value: Partial<TokenFull> & { mint: string }) {
      set((state) => {
        if (state.tokens) {
          const index = state.tokens.findIndex(
            (token) => token.mint === value.mint,
          );
          const tokens = [...state.tokens];
          tokens[index] = { ...state.tokens[index], ...value };

          return { tokens };
        }
        return state;
      });
    },

    onWsEvent(event) {
      set((state) => {
        switch (event.type) {
          case "metadata":
            return onMetadata(state, event);
          case "liquidity":
            return onLiquidity(state, event);
          case "stats":
            return onStats(state, event);
          case "swap":
            return onSwap(state, event);
          case "pool_create":
            return onPoolCreate(state, event);
          case "surge":
            return onSurge(state, event);
          case "radar":
            return onRadar(state, event);
          default:
            return state;
        }
      });
    },
  };
});
