"use client";

import { useEffect } from "react";
import {
  useGlobalMarketWebSocket,
  useGlobalMetadataWebSocket,
} from "@/features/market/market.ws";
import {
  useBlacklistStore,
  isTokenBlacklistedMatch,
} from "@/features/market/blacklist.store";
import {
  useFresh,
  useGraduated,
  useHeatingUp,
  useLatest,
  useStableCoin,
  useStock,
  useSurge,
  useTopGainer,
  useTrending,
  useWatchList,
} from "@/states";

export const GlobalMetadataListener = () => {
  useGlobalMetadataWebSocket();
  useGlobalMarketWebSocket();

  useEffect(() => {
    return useBlacklistStore.subscribe((state) => {
      const items = state.items;
      if (!items || items.length === 0) return;

      const stores = [
        useTrending,
        useSurge,
        useLatest,
        useTopGainer,
        useFresh,
        useHeatingUp,
        useGraduated,
        useStock,
        useStableCoin,
        useWatchList,
      ];

      for (const store of stores) {
        const tokens = store.getState().tokens;
        if (tokens && tokens.length > 0) {
          const filtered = tokens.filter(
            (t) => !isTokenBlacklistedMatch(t, items),
          );
          if (filtered.length !== tokens.length) {
            store.getState().setTokens(filtered);
          }
        }
      }
    });
  }, []);

  return null;
};
