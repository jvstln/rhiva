/**
 * Market data layer — the ONE place to change where market data comes from.
 *
 * Every function returns fully-enriched `TokenFull[]` objects (the shared token
 * type from `@rhivadotfun/dataapi`). They are called by the hooks in
 * `market.hook.ts`, which feed the props of `MarketPage`/`RadarPage`.
 * To integrate a real backend, swap the `dataapi.*` calls here — the UI code
 * (and the hooks) stay untouched.
 */
import type { TokenFull, Window } from "@rhivadotfun/dataapi";

import { dataapi } from "@/lib/dataapi";
import type { RadarFilters, TrendingFilters } from "./market.type";
import { TIMEFRAME_TO_WINDOW } from "./market.schema";

export type SurgeParams = {
  window?: Window;
  direction?: "gainers" | "losers";
  limit?: number;
};

export const getTokens = async (
  mints: Array<string | undefined>,
): Promise<TokenFull[]> => {
  const valid = mints.filter((m): m is string => Boolean(m));
  if (valid.length === 0) return [];
  const results = await Promise.allSettled(
    valid.map((address) => dataapi.token.getToken({ address })),
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<TokenFull> =>
        r.status === "fulfilled" && Boolean(r.value),
    )
    .map((r) => r.value);
};

export const getTrendingTokens = async (
  filters: TrendingFilters,
): Promise<TokenFull[]> => {
  const window: Window =
    (filters.timeframe ? TIMEFRAME_TO_WINDOW[filters.timeframe] : undefined) ??
    "86400";

  const response = await dataapi.token.getTrending({
    enrich: true,
    window,
    limit: 50,
  });

  const enriched = response
    .map((item) => ("token" in item ? item.token : null))
    .filter((t): t is TokenFull => Boolean(t));

  if (enriched.length > 0) return enriched;
  return await getTokens(response.map((t) => t.mint));
};

export const getRadarTokens = async (
  filters: RadarFilters[keyof RadarFilters] & { type: keyof RadarFilters },
): Promise<TokenFull[]> => {
  if (filters.type === "fresh") {
    const launches = await dataapi.token.getLaunches({ limit: 50 });
    return await getTokens(launches.map((l) => l.mint));
  }
  if (filters.type === "heatingUp") {
    const graduating = await dataapi.token.getGraduating({
      enrich: true,
      limit: 50,
    });
    const enriched = graduating
      .map((item) => ("token" in item ? item.token : null))
      .filter((t): t is TokenFull => Boolean(t));
    if (enriched.length > 0) return enriched;
    return await getTokens(graduating.map((g) => g.mint));
  }
  if (filters.type === "graduated") {
    const graduated = await dataapi.token.getGraduated({
      enrich: true,
      launchpad: "pumpfun",
      limit: 50,
    });
    const enriched = graduated
      .map((item) => ("token" in item ? item.token : null))
      .filter((t): t is TokenFull => Boolean(t));
    if (enriched.length > 0) return enriched;
    return await getTokens(graduated.map((g) => g.mint));
  }
  return [];
};

export const getSurgeTokens = async (params: SurgeParams) => {
  const movers = await dataapi.token.getMovers({
    enrich: true,
    limit: 50,
    ...params,
  });
  const enriched = movers
    .map((item) => ("token" in item ? item.token : null))
    .filter((t): t is TokenFull => Boolean(t));
  if (enriched.length > 0) return enriched;
  return await getTokens(movers.map((m) => m.mint));
};

export const getTokenCandles = async (params: {
  mint: string;
  interval?: "1m";
  from?: number;
  to?: number;
  count?: number;
}) => {
  const { mint, ...rest } = params;
  return await dataapi.token.getTokenOhlcv({ address: mint, ...rest });
};

export const getTokenTrades = async (mint: string) => {
  return await dataapi.token.getTokenTrades({ address: mint, limit: 100 });
};

export const getTokenHolders = async (mint: string) => {
  return await dataapi.token.getTokenHolders({ address: mint, limit: 50 });
};

export const getTokenTopTraders = async (mint: string) => {
  return await dataapi.token.getTopTraders({
    address: mint,
    sort: "realized",
    limit: 50,
  });
};

export const getTokenPools = async (mint: string) => {
  return await dataapi.token.getTokenPools({ address: mint });
};

export const getTokenDevHistory = async (mint: string) => {
  return await dataapi.token.getTokenDevHistory({ address: mint });
};

export const getTokenSecurity = async (mint: string) => {
  return await dataapi.token.getTokenSecurity({ address: mint });
};

export const getTokenPrice = async (mint: string) => {
  return await dataapi.token.getTokenPrice({ address: mint, liquidity: true });
};

export const getSearchTokens = async (query: string): Promise<TokenFull[]> => {
  if (!query) return [];
  const results = await dataapi.token.searchToken({ q: query, enrich: true });
  return await getTokens(results.map((r) => r.mint));
};
