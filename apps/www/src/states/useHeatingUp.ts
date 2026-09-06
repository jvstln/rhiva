import { create } from "zustand";
import type {
  WsEvent,
  TokenFull,
  BaseTokenFilterParams,
} from "@rhivadotfun/dataapi";

import {
  onMeme,
  onSwap,
  onStats,
  onRadar,
  onSurge,
  onCandle,
  onTransfer,
  onMetadata,
  onLiquidity,
  onGraduated,
  onGraduating,
  onGraduation,
  onPoolCreate,
  onTokenCreate,
} from "./token/actions";

type State = {
  tokens: TokenFull[] | null;
  queries: Partial<BaseTokenFilterParams> | null;
};

type Action = {
  setTokens(value: TokenFull[]): void;
  addTokens(...value: TokenFull[]): void;
  removeToken(id: TokenFull["mint"]): void;
  updateToken(value: Partial<TokenFull> & { mint: string }): void;
  updateQueries(value: Partial<BaseTokenFilterParams> | null): void;
  onWsEvent: (
    event: Extract<
      WsEvent,
      | { type: "metadata" }
      | { type: "graduation" }
      | { type: "graduated" }
      | { type: "graduating" }
      | { type: "liquidity" }
      | { type: "stats" }
      | { type: "swap" }
      | { type: "candle" }
      | { type: "pool_create" }
      | { type: "transfer" }
      | { type: "surge" }
      | { type: "radar" }
      | { type: "meme" }
      | { type: "token_create" }
      | { type: "launches" }
    >,
  ) => void;
};

export const useHeatingUp = create<State & Action>((set) => {
  return {
    tokens: null,
    queries: null,
    updateQueries(value) {
      set((state) => {
        const newState = { ...state.queries };
        return { queries: { ...newState, ...value } };
      });
    },
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
          case "graduation":
            return onGraduation(state, event);
          case "graduated":
            return onGraduated(state, event);
          case "liquidity":
            return onLiquidity(state, event);
          case "stats":
            return onStats(state, event);
          case "swap":
            return onSwap(state, event);
          case "candle":
            return onCandle(state, event);
          case "pool_create":
            return onPoolCreate(state, event);
          case "radar":
            return onRadar(state, event);
          case "transfer":
            return onTransfer(state, event);
          case "surge":
            return onSurge(state, event);
          case "meme":
            return onMeme(state, event);
          case "token_create":
            return onTokenCreate(state, event);
          case "graduating":
            return onGraduating(state, event, { set });
          default:
            return state;
        }
      });
    },
  };
});
