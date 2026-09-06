import type { StateCreator } from "zustand";
import type { TokenFull } from "@rhivadotfun/dataapi";

import { useBlacklistStore, isTokenBlacklistedMatch } from "./blacklist.store";

export const blacklistMiddleware =
  <T extends { tokens?: TokenFull[] | null }>(
    config: StateCreator<T, [], []>,
  ): StateCreator<T, [], []> =>
  (set, get, api) => {
    const customSet: typeof set = ((next: unknown, replace?: boolean) => {
      const blacklistItems = useBlacklistStore.getState().items;

      if (typeof next === "function") {
        set((state: T) => {
          const resolved = (next as (state: T) => Partial<T> | T)(state);
          if (
            resolved &&
            typeof resolved === "object" &&
            "tokens" in resolved &&
            Array.isArray(resolved.tokens) &&
            blacklistItems.length > 0
          ) {
            return {
              ...resolved,
              tokens: resolved.tokens.filter(
                (token: TokenFull) =>
                  !isTokenBlacklistedMatch(token, blacklistItems),
              ),
            };
          }
          return resolved as T;
        }, replace as false);
      } else if (next && typeof next === "object") {
        if (
          "tokens" in next &&
          Array.isArray((next as { tokens?: TokenFull[] }).tokens) &&
          blacklistItems.length > 0
        ) {
          const casted = next as { tokens: TokenFull[] };
          set(
            {
              ...next,
              tokens: casted.tokens.filter(
                (token) => !isTokenBlacklistedMatch(token, blacklistItems),
              ),
            } as unknown as Partial<T>,
            replace as false,
          );
          return;
        }
        set(next as Partial<T>, replace as false);
      } else {
        set(next as Partial<T>, replace as false);
      }
    }) as typeof set;

    return config(customSet, get, api);
  };
