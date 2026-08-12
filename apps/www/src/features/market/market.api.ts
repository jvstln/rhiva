import type {
  CandlesQuery,
  SurgeQuery,
  TokenDetail,
} from "@rhivadotfun/dataapi";

import { dataapi } from "@/lib/dataapi";
import type { RadarFilters, TrendingFilters } from "./market.type";

export const getTokens = async (mints: Array<string | undefined>) => {
  const response = await dataapi.tokens.getTokensBatch({
    mints: mints.filter(Boolean).join(","),
  });
  return response;
};

export const getTrendingTokens = async (
  filters: TrendingFilters,
): Promise<TokenDetail[]> => {
  const response = await dataapi.tokens.getTrending({
    limit: null,
    window: filters.timeframe,
  });

  return await getTokens(response.map((token) => token.mint));
};

export const getRadarTokens = async (
  filters: RadarFilters[keyof RadarFilters] & { type: keyof RadarFilters },
) => {
  const stageMap: Record<keyof RadarFilters, string> = {
    fresh: "new_creation",
    graduated: "completed",
    heatingUp: "near_completion",
  };

  const response = await dataapi.tokens.getTrenches({
    limit: null,
    stage: stageMap[filters.type],
  });

  return await getTokens(response.map(({ mint }) => mint));
};

export const getSurgeTokens = async (params: SurgeQuery) => {
  const response = await dataapi.tokens.getSurge(params);

  const tokens = new Map(
    (await getTokens(response.map((token) => token.mint))).map((token) => [
      token.mint,
      token,
    ]),
  );
  const combinedTokens = response.map((data) => ({
    ...tokens.get(data.mint),
    ...data,
  }));

  return combinedTokens;
};

export const getTokenCandles = async (
  params: CandlesQuery & { mint: string },
) => {
  const { mint, ...rest } = params;
  return await dataapi.tokens.getTokenCandles(mint, rest);
};

export const getTokenTrades = async (mint: string) => {
  return await dataapi.tokens.getTokenTrades(mint);
};

export const getSearchTokens = async (
  query: string,
): Promise<TokenDetail[]> => {
  if (!query) return [];

  const response = await dataapi.tokens.getScreener({
    query,
    limit: 10,
    launchpad: null,
    stage: null,
    min_pct: null,
    max_pct: null,
    min_age_sec: null,
    max_age_sec: null,
    min_mcap: null,
    max_mcap: null,
    min_holders: null,
    max_holders: null,
    min_top10_pct: null,
    max_top10_pct: null,
    min_dev_pct: null,
    max_dev_pct: null,
    min_liquidity: null,
    min_volume_1h: null,
    has_socials: null,
    dex_boost: null,
    dex_paid: null,
    dev_sold: null,
    mint_auth_disabled: null,
    freeze_auth_disabled: null,
    include_incomplete: null,
    sort: null,
    order: null,
    offset: null,
  });

  if (response.length === 0) return [];
  return await getTokens(response.map((token) => token.mint));
};
