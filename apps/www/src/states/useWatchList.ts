import { create } from "zustand";
import type { TokenFull, WsEvent } from "@rhivadotfun/dataapi";

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
} from "./token/actions";

type State = {
  watchlists: string[] | null;
  tokens: TokenFull[] | null;
};

type Action = {
  addWatchlist(value: string): void;
  removeWatchlist(value: string): void;
  setTokens(value: TokenFull[]): void;
  onWsEvent: (event: WsEvent) => void;
  addTokens(...value: TokenFull[]): void;
  removeToken(id: TokenFull["mint"]): void;
  updateToken(value: Partial<TokenFull> & { mint: string }): void;
};

export const useWatchList = create<State & Action>((set) => {
  return {
    tokens: null,
    watchlists: null,
    addWatchlist(value) {
      set((state) => {
        const watchlists = state.watchlists
          ? [...state.watchlists, value]
          : [value];
        return { watchlists };
      });
    },
    removeWatchlist(value) {
      set((state) => {
        const watchlists = state.watchlists?.filter(
          (watchlist) => watchlist !== value,
        );
        return { watchlists };
      });
    },
    addTokens(...tokens: TokenFull[]) {
      set((state) => ({ tokens: [...(state.tokens ?? []), ...tokens] }));
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
            return onMeme(state, event);
          case "token_create":
            return onTokenCreate(state, event);
          default:
            return state;
        }
      });
    },
  };
});
