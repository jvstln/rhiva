"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getRadarTokens,
  getSurgeTokens,
  getToken,
  getTokenCandles,
  getTrendingTokens,
} from "./market.api";
import type {
  RadarFilters,
  SurgeFiltersInput,
  TokenCandleFilters,
  TrendingFilters,
} from "./market.type";
import { SurgeFilters } from "./market.schema";
import { useMarketStore } from "./market.store";

export function useToken(mint: string) {
  return useQuery({
    queryKey: ["token", mint],
    queryFn: () => getToken(mint),
  });
}

export function useTrendingTokens(filters: TrendingFilters) {
  return useQuery({
    queryKey: ["market", "trending", filters.timeframe, filters.preset],
    queryFn: () => getTrendingTokens(filters),
  });
}

export function useWatchlistTokens() {
  const watchlist = useMarketStore((state) => state.watchlist.items);

  return useQueries({
    queries: watchlist.map((mint) => ({
      queryKey: ["token", mint],
      queryFn: () => getToken(mint),
    })),
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
    queryFn: () => getSurgeTokens(params),
  });
}

export function useTokenCandles(filters: TokenCandleFilters) {
  return useQuery({
    queryKey: ["token", "candles", filters],
    queryFn: () => getTokenCandles(filters),
  });
}
