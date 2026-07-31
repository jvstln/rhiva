import { api } from "@/lib/api";
import { mapToken } from "./market.util";
import type {
  Token,
  RadarFilters,
  RawToken,
  SurgeFilters,
  TokenCandle,
  TrendingFilters,
  TokenCandleFilters,
  TokenTrade,
} from "./market.type";

export const getTokens = async (mints: string[]) => {
  const response = await api.get<RawToken[]>(
    `/tokens?mints=${mints.join(",")}`,
  );
  return response.data.map((token) => mapToken(token));
};

export const getTrendingTokens = async (
  filters: TrendingFilters,
): Promise<{ tokens: Token[] }> => {
  const trendingResponse = await api.get<Array<{ mint: string }>>("/trending", {
    params: { window: filters.timeframe },
  });

  const tokens = await getTokens(trendingResponse.data.map((t) => t.mint));

  return { tokens };
};

export const getRadarTokens = async (
  filters: RadarFilters[keyof RadarFilters] & { type: keyof RadarFilters },
) => {
  const stageMap: Record<keyof RadarFilters, string> = {
    fresh: "new_creation",
    heatingUp: "near_completion",
    graduated: "completed",
  };

  const radarResponse = await api.get<Array<{ mint: string }>>("/trenches", {
    params: {
      stage: stageMap[filters.type],
    },
  });

  const tokens = await getTokens(radarResponse.data.map((t) => t.mint));

  return { tokens };
};

export const getSurgeTokens = async (params: SurgeFilters) => {
  const surgeResponse = await api.get<RawToken[]>("/surge", {
    params,
  });

  const tokens = await getTokens(surgeResponse.data.map((t) => t.mint));
  const combinedTokens = tokens.map((token) => {
    return mapToken({
      ...token.original,
      ...surgeResponse.data.find((t) => t.mint === token.mint),
    });
  });

  return { tokens: combinedTokens };
};

export const getTokenCandles = async (filters: TokenCandleFilters) => {
  const response = await api.get<TokenCandle[]>(
    `/token/${filters.mint}/candles`,
    {
      params: { tf: filters.timeframe, limit: filters.limit },
    },
  );

  return response.data;
};

export const getTokenTrades = async (mint: string) => {
  const response = await api.get<TokenTrade[]>(`/token/${mint}/trades`);

  return response.data;
};
