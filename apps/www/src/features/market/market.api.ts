import type {
  CandlesQuery,
  SurgeQuery,
  TokenDetail,
} from "@rhivadotfun/dataapi";

import { dataapi } from "@/lib/dataapi";
import type { RadarFilters, TrendingFilters } from "./market.type";

export const getTokens = async (mints: string[]) => {
  const response = await dataapi.tokens.getTokensBatch({
    mints: mints.join(","),
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
