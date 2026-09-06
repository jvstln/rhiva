import { create } from "zustand";
import type {
  WsEvent,
  TokenFull,
  BaseTokenFilterParams,
} from "@rhivadotfun/dataapi";

import { blacklistMiddleware } from "@/features/market/blacklist.middleware";
import { queryClient } from "@/lib";
import {
  onMeme,
  onSwap,
  onStats,
  onRadar,
  onSurge,
  onMetadata,
  onLiquidity,
  onGraduated,
  onGraduating,
  onGraduation,
  onPoolCreate,
  onTokenCreate,
  onTokenUpdate,
  onLaunches,
  onMover,
  mergeFreshTokens,
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
      | { type: "pool_create" }
      | { type: "surge" }
      | { type: "radar" }
      | { type: "meme" }
      | { type: "token_create" }
      | { type: "launches" }
      | { type: "token_update" }
      | { type: "movers" }
    >,
  ) => void;
};

export const useTrending = create<State & Action>()(
  blacklistMiddleware((set) => {
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
        set((state) => ({ tokens: mergeFreshTokens(state.tokens, tokens) }));
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
            case "graduating":
              return onGraduating(state, event);
            case "liquidity":
              return onLiquidity(state, event);
            case "stats":
              return onStats(state, event);
            case "swap":
              return onSwap(state, event);
            case "pool_create":
              return onPoolCreate(state, event);
            case "radar":
              return onRadar(state, event);
            case "surge":
              return onSurge(state, event);
            case "meme":
              return onMeme(state, event, true);
            case "token_create":
              return onTokenCreate(state, event, true);
            case "launches":
              return onLaunches(state, event);
            case "token_update":
              return onTokenUpdate(state, event);
            case "movers":
              return onMover(state, event);

            default:
              return state;
          }
        });
      },
    };
  }),
);

useTrending.subscribe((state) => {
  if (state.tokens && state.tokens.length > 0) {
    queryClient.setQueriesData<TokenFull[]>(
      { queryKey: ["market", "trending"] },
      state.tokens,
    );
  }
});
