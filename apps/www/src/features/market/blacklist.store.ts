import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TokenFull } from "@rhivadotfun/dataapi";

import { queryClient } from "@/lib";

export type BlacklistCategory =
  | "dev"
  | "ca"
  | "keyword"
  | "website"
  | "twitter";

export type BlacklistItem = {
  id: string;
  type: BlacklistCategory;
  value: string;
  createdAt: number;
};

export type BlacklistState = {
  items: BlacklistItem[];
  addItem: (type: BlacklistCategory, value: string) => boolean;
  removeItem: (id: string) => void;
  clearAll: () => void;
  importItems: (
    items: Array<BlacklistItem | { type: BlacklistCategory; value: string }>,
  ) => number;
  isTokenBlacklisted: (token: Partial<TokenFull> | null | undefined) => boolean;
  filterTokens: <T extends Partial<TokenFull>>(tokens: T[]) => T[];
};

export const isTokenBlacklistedMatch = (
  token: Partial<TokenFull> | null | undefined,
  items: BlacklistItem[],
): boolean => {
  if (!token || !items || items.length === 0) return false;

  const mint = token.mint?.toLowerCase();
  const name = token.name?.toLowerCase() ?? "";
  const symbol = token.symbol?.toLowerCase() ?? "";
  const dev = (
    token.creator ??
    token.dev?.wallet ??
    (token as { screener?: { dev?: string } })?.screener?.dev ??
    ""
  ).toLowerCase();
  const twitter = (
    token.socials?.x ??
    (token as { screener?: { twitter?: string } })?.screener?.twitter ??
    ""
  ).toLowerCase();
  const website = (
    token.socials?.website ??
    (token as { screener?: { website?: string } })?.screener?.website ??
    ""
  ).toLowerCase();

  for (const item of items) {
    const val = item.value.trim().toLowerCase();
    if (!val) continue;

    switch (item.type) {
      case "ca": {
        if (mint && mint === val) return true;
        break;
      }
      case "dev": {
        if (dev && (dev === val || dev.includes(val))) return true;
        break;
      }
      case "twitter": {
        const cleanHandle = val
          .replace(/^@/, "")
          .replace(/.*twitter\.com\//, "")
          .replace(/.*x\.com\//, "");
        if (cleanHandle && twitter.includes(cleanHandle)) return true;
        break;
      }
      case "website": {
        const cleanUrl = val.replace(/^https?:\/\//, "").replace(/\/$/, "");
        if (cleanUrl && website.includes(cleanUrl)) return true;
        break;
      }
      case "keyword": {
        if (name.includes(val) || symbol.includes(val)) return true;
        break;
      }
    }
  }

  return false;
};

const invalidateTokenQueries = () => {
  try {
    queryClient.invalidateQueries({ queryKey: ["market"] });
    queryClient.invalidateQueries({ queryKey: ["tokens"] });
  } catch {
    // ignore in environments where queryClient isn't mounted yet
  }
};

export const useBlacklistStore = create<BlacklistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (type, value) => {
        const trimmed = value.trim();
        if (!trimmed) return false;

        const id = `${type}:${trimmed.toLowerCase()}`;
        const currentItems = get().items;
        if (currentItems.some((item) => item.id === id)) {
          return false;
        }

        const newItem: BlacklistItem = {
          id,
          type,
          value: trimmed,
          createdAt: Date.now(),
        };

        set({ items: [newItem, ...currentItems] });
        invalidateTokenQueries();
        return true;
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        invalidateTokenQueries();
      },

      clearAll: () => {
        set({ items: [] });
        invalidateTokenQueries();
      },

      importItems: (incomingItems) => {
        const currentItems = get().items;
        const currentMap = new Map(currentItems.map((item) => [item.id, item]));
        let addedCount = 0;

        for (const item of incomingItems) {
          const trimmed = item.value?.trim();
          if (!trimmed || !item.type) continue;
          const id = `${item.type}:${trimmed.toLowerCase()}`;
          if (!currentMap.has(id)) {
            currentMap.set(id, {
              id,
              type: item.type,
              value: trimmed,
              createdAt:
                "createdAt" in item && typeof item.createdAt === "number"
                  ? item.createdAt
                  : Date.now(),
            });
            addedCount++;
          }
        }

        set({ items: Array.from(currentMap.values()) });
        invalidateTokenQueries();
        return addedCount;
      },

      isTokenBlacklisted: (token) => {
        return isTokenBlacklistedMatch(token, get().items);
      },

      filterTokens: (tokens) => {
        const items = get().items;
        if (!items || items.length === 0) return tokens;
        return tokens.filter((token) => !isTokenBlacklistedMatch(token, items));
      },
    }),
    {
      name: "rhiva.blacklist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
