"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TokenFull } from "@rhivadotfun/dataapi";

import type { SearchParams } from "@/types";
import {
  type MarketView,
  Preset,
  SurgeFilters,
  Timeframe,
} from "./market.schema";
import { useMarketStore } from "./market.store";
import type {
  MarketState,
  RadarFilters,
  SurgeFiltersInput,
  TrendingFilters,
} from "./market.type";
import {
  useFresh,
  useGraduated,
  useHeatingUp,
  useLatest,
  useSurge,
  useTopGainer,
  useTrending,
  useWatchList,
} from "@/states";
import { mergeFreshTokens } from "@/states/token/utils";
import { useBlacklistStore } from "./blacklist.store";
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

async function reconcileWithHttp(
  existing: TokenFull[] | undefined | null,
  httpTokens: TokenFull[],
): Promise<TokenFull[]> {
  const isBlacklisted = (t: TokenFull) => {
    try {
      return useBlacklistStore.getState().isTokenBlacklisted(t);
    } catch {
      return false;
    }
  };
  const filteredHttp = httpTokens.filter((t) => !isBlacklisted(t));
  if (!existing || existing.length === 0) return filteredHttp;

  // Find any tokens in existing that came from WebSocket and aren't in httpTokens yet
  const httpMints = new Set(httpTokens.map((t) => t.mint));
  const wsOnlyMints = existing
    .filter((t) => !httpMints.has(t.mint))
    .map((t) => t.mint);

  // If there are WS-only tokens, enrich them top-level via getTokens
  let enrichedWsTokens: TokenFull[] = [];
  if (wsOnlyMints.length > 0) {
    try {
      enrichedWsTokens = await getTokens(wsOnlyMints);
    } catch {
      enrichedWsTokens = [];
    }
  }

  const allIncoming = [...httpTokens, ...enrichedWsTokens];
  return mergeFreshTokens(existing, allIncoming);
}

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
export type TokenQuery = {
  data: TokenFull[] | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  status?: "pending" | "error" | "success";
};

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
  options?: QueryOptions & { view?: MarketView },
): TokenQuery {
  const activeView = options?.view ?? "trending";
  const enabled = options?.enabled !== false;

  // Stablecoin / stocks - Leave out for now
  const isExcluded = activeView === "stock" || activeView === "stablecoin";

  const trendingTokens = useTrending((s) => s.tokens);
  const latestTokens = useLatest((s) => s.tokens);
  const topGainerTokens = useTopGainer((s) => s.tokens);

  const activeStoreTokens =
    activeView === "latest"
      ? latestTokens
      : activeView === "top-gainers"
        ? topGainerTokens
        : trendingTokens;

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inFlightRef = useRef(false);
  const lastFetchedKeyRef = useRef<string>("");

  const fetchDirect = useCallback(async () => {
    if (isExcluded || inFlightRef.current) return;
    inFlightRef.current = true;
    if (!activeStoreTokens) {
      setIsPending(true);
    }
    setIsError(false);
    setError(null);

    try {
      let httpTokens: TokenFull[] = [];
      if (activeView === "latest") {
        httpTokens = await getRadarTokens({
          type: "fresh",
          preset: filters.preset,
          search: "",
          quickBuy: filters.quickBuy,
          quickSell: filters.quickSell,
        });
        const current = useLatest.getState().tokens;
        const reconciled = await reconcileWithHttp(current, httpTokens);
        useLatest.getState().setTokens(reconciled);
      } else if (activeView === "top-gainers") {
        httpTokens = await getSurgeTokens({ direction: "gainers", limit: 50 });
        const current = useTopGainer.getState().tokens;
        const reconciled = await reconcileWithHttp(current, httpTokens);
        useTopGainer.getState().setTokens(reconciled);
      } else {
        httpTokens = await getTrendingTokens(filters);
        const current = useTrending.getState().tokens;
        const reconciled = await reconcileWithHttp(current, httpTokens);
        useTrending.getState().setTokens(reconciled);
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
      inFlightRef.current = false;
    }
  }, [activeView, filters, isExcluded, activeStoreTokens]);

  const requestKey = `${activeView}:${JSON.stringify(filters)}`;

  useEffect(() => {
    if (!enabled || isExcluded) return;
    if (lastFetchedKeyRef.current === requestKey && activeStoreTokens) {
      return;
    }
    lastFetchedKeyRef.current = requestKey;
    fetchDirect();
  }, [enabled, isExcluded, requestKey, fetchDirect, activeStoreTokens]);

  return {
    data: activeStoreTokens,
    isPending: activeStoreTokens ? false : isPending,
    isError,
    error,
    refetch: fetchDirect,
    status: isError ? "error" : activeStoreTokens ? "success" : "pending",
  };
}

export function useWatchlistTokens(
  mints: string[],
  options?: QueryOptions,
): TokenQuery {
  const enabled = options?.enabled !== false && mints.length > 0;
  const storeTokens = useWatchList((s) => s.tokens);

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inFlightRef = useRef(false);
  const lastFetchedKeyRef = useRef<string>("");

  const fetchDirect = useCallback(async () => {
    if (!mints.length || inFlightRef.current) return;
    inFlightRef.current = true;
    if (!storeTokens) {
      setIsPending(true);
    }
    setIsError(false);
    setError(null);

    try {
      const httpTokens = await getTokens(mints);
      const current = useWatchList.getState().tokens;
      const reconciled = await reconcileWithHttp(current, httpTokens);
      useWatchList.getState().setTokens(reconciled);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
      inFlightRef.current = false;
    }
  }, [mints, storeTokens]);

  const requestKey = [...mints].sort().join(",");

  useEffect(() => {
    if (!enabled) return;
    if (lastFetchedKeyRef.current === requestKey && storeTokens) {
      return;
    }
    lastFetchedKeyRef.current = requestKey;
    fetchDirect();
  }, [enabled, requestKey, fetchDirect, storeTokens]);

  return {
    data: storeTokens,
    isPending: storeTokens ? false : isPending,
    isError,
    error,
    refetch: fetchDirect,
    status: isError ? "error" : storeTokens ? "success" : "pending",
  };
}

export function useRadarTokens(
  filters: RadarFilters[keyof RadarFilters] & { type: keyof RadarFilters },
  options?: QueryOptions,
): TokenQuery {
  const enabled = options?.enabled !== false;

  const freshTokens = useFresh((s) => s.tokens);
  const heatingUpTokens = useHeatingUp((s) => s.tokens);
  const graduatedTokens = useGraduated((s) => s.tokens);

  const storeTokens =
    filters.type === "fresh"
      ? freshTokens
      : filters.type === "heatingUp"
        ? heatingUpTokens
        : graduatedTokens;

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inFlightRef = useRef(false);
  const lastFetchedKeyRef = useRef<string>("");

  const fetchDirect = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (!storeTokens) {
      setIsPending(true);
    }
    setIsError(false);
    setError(null);

    try {
      const httpTokens = await getRadarTokens(filters);
      if (filters.type === "fresh") {
        const current = useFresh.getState().tokens;
        const reconciled = await reconcileWithHttp(current, httpTokens);
        useFresh.getState().setTokens(reconciled);
      } else if (filters.type === "heatingUp") {
        const current = useHeatingUp.getState().tokens;
        const reconciled = await reconcileWithHttp(current, httpTokens);
        useHeatingUp.getState().setTokens(reconciled);
      } else if (filters.type === "graduated") {
        const current = useGraduated.getState().tokens;
        const reconciled = await reconcileWithHttp(current, httpTokens);
        useGraduated.getState().setTokens(reconciled);
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
      inFlightRef.current = false;
    }
  }, [filters, storeTokens]);

  const requestKey = `${filters.type}:${JSON.stringify(filters)}`;

  useEffect(() => {
    if (!enabled) return;
    if (lastFetchedKeyRef.current === requestKey && storeTokens) {
      return;
    }
    lastFetchedKeyRef.current = requestKey;
    fetchDirect();
  }, [enabled, requestKey, fetchDirect, storeTokens]);

  return {
    data: storeTokens,
    isPending: storeTokens ? false : isPending,
    isError,
    error,
    refetch: fetchDirect,
    status: isError ? "error" : storeTokens ? "success" : "pending",
  };
}

export function useSurgeTokens(
  filters: SurgeFiltersInput,
  options?: QueryOptions,
): TokenQuery {
  const params = SurgeFilters.parse(filters);
  const enabled = options?.enabled !== false;
  const storeTokens = useSurge((s) => s.tokens);

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inFlightRef = useRef(false);
  const lastFetchedKeyRef = useRef<string>("");

  const fetchDirect = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (!storeTokens) {
      setIsPending(true);
    }
    setIsError(false);
    setError(null);

    try {
      const httpTokens = await getSurgeTokens({
        direction: params.direction === "down" ? "losers" : "gainers",
        limit: 50,
      });
      const current = useSurge.getState().tokens;
      const reconciled = await reconcileWithHttp(current, httpTokens);
      useSurge.getState().setTokens(reconciled);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
      inFlightRef.current = false;
    }
  }, [params.direction, storeTokens]);

  const requestKey = JSON.stringify(params);

  useEffect(() => {
    if (!enabled) return;
    if (lastFetchedKeyRef.current === requestKey && storeTokens) {
      return;
    }
    lastFetchedKeyRef.current = requestKey;
    fetchDirect();
  }, [enabled, requestKey, fetchDirect, storeTokens]);

  return {
    data: storeTokens,
    isPending: storeTokens ? false : isPending,
    isError,
    error,
    refetch: fetchDirect,
    status: isError ? "error" : storeTokens ? "success" : "pending",
  };
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
    refetchInterval: 3_000,
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
