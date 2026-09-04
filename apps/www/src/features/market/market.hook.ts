"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TokenFull } from "@rhivadotfun/dataapi";

import type { SearchParams } from "@/types";
import { Preset, SurgeFilters, Timeframe } from "./market.schema";
import { useMarketStore } from "./market.store";
import type {
  MarketState,
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

/**
 * Market data hooks — React Query wrappers around `market.api.ts`.
 *
 * Every hook fetches one resource and returns a `TokenQuery` (a
 * `UseQueryResult<TokenFull[], Error>`). Route pages (`market/page.tsx`,
 * `radar/page.tsx`) OWN these hooks and pass the results down to the UI
 * components as props — the components themselves never fetch.
 *
 * To integrate a real API, edit the fetch functions in `market.api.ts`; the
 * hooks and UI don't need to change.
 *
 * NOTE: the `queryKey`s below are referenced by `market.ws.ts`, which patches
 * the cache with live websocket updates — don't rename them casually.
 */
export type TokenCandleFilters = {
  mint: string;
  interval?: "1m";
  from?: number;
  to?: number;
  count?: number;
};

/** Optional `enabled` flag — route pages pass it to avoid fetching inactive views. */
export type QueryOptions = { enabled?: boolean };

/** Shape of the query the market views receive as a prop (token list + loading/error state). */
export type TokenQuery = UseQueryResult<TokenFull[], Error>;

/** One query per radar column ("fresh", "heatingUp", "graduated"). */
export type RadarQueries = {
  fresh: TokenQuery;
  heatingUp: TokenQuery;
  graduated: TokenQuery;
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

export function useTrendingTokens(
  filters: TrendingFilters,
  options?: QueryOptions,
) {
  return useQuery({
    queryKey: ["market", "trending"],
    queryFn: () => getTrendingTokens(filters),
    enabled: options?.enabled,
  });
}

export function useWatchlistTokens(mints: string[], options?: QueryOptions) {
  return useQuery({
    queryKey: ["tokens", [...mints].sort().join(",")],
    queryFn: () => getTokens(mints),
    // Don't fetch when the watchlist is empty or the view is hidden.
    enabled: options?.enabled && mints.length > 0,
  });
}

export function useRadarTokens(
  filters: RadarFilters[keyof RadarFilters] & { type: keyof RadarFilters },
  options?: QueryOptions,
) {
  return useQuery({
    queryKey: ["market", "radar", filters.type],
    queryFn: () => getRadarTokens(filters),
    enabled: options?.enabled,
  });
}

export function useSurgeTokens(
  filters: SurgeFiltersInput,
  options?: QueryOptions,
) {
  const params = SurgeFilters.parse(filters);

  return useQuery({
    queryKey: ["market", "surge", params],
    queryFn: () =>
      getSurgeTokens({
        direction: params.direction === "down" ? "losers" : "gainers",
        limit: 50,
      }),
    enabled: options?.enabled,
  });
}

/**
 * Seeds the market filter store from URL search params (e.g. `?timeframe=1h&preset=p3`)
 * on mount. Interactive filter state stays in the store afterwards.
 */
export function useMarketFiltersFromSearchParams(
  params: SearchParams | undefined,
) {
  useEffect(() => {
    const timeframe = Timeframe.safeParse(params?.timeframe).data;
    const preset = Preset.safeParse(params?.preset).data;

    if (!timeframe && !preset) return;

    useMarketStore.setState((state) => {
      const { trendingFilters, surgeFilters, radarFilters } = state;

      return {
        ...(timeframe
          ? {
              trendingFilters: { ...trendingFilters, timeframe },
              surgeFilters: { ...surgeFilters, timeframe },
            }
          : {}),
        ...(preset
          ? {
              trendingFilters: { ...trendingFilters, preset },
              surgeFilters: { ...surgeFilters, preset },
              radarFilters: {
                fresh: { ...radarFilters.fresh, preset },
                heatingUp: { ...radarFilters.heatingUp, preset },
                graduated: { ...radarFilters.graduated, preset },
              },
            }
          : {}),
      } satisfies Partial<MarketState>;
    });
  }, [params?.timeframe, params?.preset]);
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
