"use client";

import { useQuery } from "@tanstack/react-query";
import { SurgeFilters } from "./market.schema";
import { useMarketStore } from "./market.store";
import type {
  RadarFilters,
  SurgeFiltersInput,
  TrendingFilters,
} from "./market.type";
import {
  getTokens,
  getRadarTokens,
  getTokenTrades,
  getTokenHolders,
  getTokenTopTraders,
  getTokenPools,
  getTokenDevHistory,
  getTokenSecurity,
  getTokenPrice,
  getSurgeTokens,
  getTokenCandles,
  getTrendingTokens,
  getSearchTokens,
} from "./market.api";

export type TokenCandleFilters = {
  mint: string;
  interval?: "1m";
  from?: number;
  to?: number;
  count?: number;
};

export function useToken(mint: string) {
  return useQuery({
    queryKey: ["token", mint],
    queryFn: async () => {
      const tokens = await getTokens([mint]);
      return tokens[0];
    },
  });
}

export function useTokens(mints: string[]) {
  return useQuery({
    queryKey: ["tokens", mints.sort().join(",")],
    queryFn: () => getTokens(mints),
    enabled: mints.length > 0,
  });
}

export function useTrendingTokens(filters: TrendingFilters) {
  return useQuery({
    queryKey: ["market", "trending"],
    queryFn: () => getTrendingTokens(filters),
  });
}

export function useWatchlistTokens() {
  const watchlistMints = useMarketStore((state) => state.watchlist.items);

  return useQuery({
    queryKey: ["tokens", watchlistMints.sort().join(",")],
    queryFn: () => getTokens(watchlistMints),
  });
}

export function useRadarTokens(
  filters: RadarFilters[keyof RadarFilters] & { type: keyof RadarFilters },
) {
  return useQuery({
    queryKey: ["market", "radar", filters.type],
    queryFn: () => getRadarTokens(filters),
  });
}

export function useSurgeTokens(filters: SurgeFiltersInput) {
  const params = SurgeFilters.parse(filters);

  return useQuery({
    queryKey: ["market", "surge", params],
    queryFn: () =>
      getSurgeTokens({
        direction: params.direction === "down" ? "losers" : "gainers",
        limit: 50,
      }),
  });
}

export function useTokenCandles(filters: TokenCandleFilters) {
  return useQuery({
    queryKey: ["token", "candles", filters],
    queryFn: () => getTokenCandles(filters),
  });
}

export function useTokenTrades(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "trades"],
    queryFn: () => getTokenTrades(mint),
  });
}

export function useTokenHolders(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "holders"],
    queryFn: () => getTokenHolders(mint),
  });
}

export function useTokenTopTraders(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "top-traders"],
    queryFn: () => getTokenTopTraders(mint),
  });
}

export function useTokenPools(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "pools"],
    queryFn: () => getTokenPools(mint),
  });
}

export function useTokenDevHistory(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "dev-history"],
    queryFn: () => getTokenDevHistory(mint),
  });
}

export function useTokenSecurity(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "security"],
    queryFn: () => getTokenSecurity(mint),
  });
}

export function useTokenPrice(mint: string) {
  return useQuery({
    queryKey: ["token", mint, "price"],
    queryFn: () => getTokenPrice(mint),
    refetchInterval: 10_000,
  });
}

export function useSearchTokens(query: string) {
  return useQuery({
    queryKey: ["tokens", "search", query],
    queryFn: () => getSearchTokens(query),
    enabled: query.trim().length > 0,
  });
}
