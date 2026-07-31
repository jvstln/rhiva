import { format } from "util";
import { api } from "@/lib/api";
import { mapToken } from "./market.util";
import type {
  Token,
  RadarFilters,
  SurgeFilters,
  TokenCandle,
  TrendingFilters,
  TokenCandleFilters,
} from "./market.type";

export const getToken = async (
  ...mints: string[]
): Promise<ReturnType<typeof mapToken>[]> => {
  const response = await api.get(format(`/tokens?mints=%s`, mints.join(",")));
  return response.data.map(mapToken);
};

export const getTrendingTokens = async (
  filters: TrendingFilters,
): Promise<{ tokens: Token[] }> => {
  const trendingResponse = await api.get<
    Array<{ mint: string; score: number }>
  >("/trending", {
    params: { window: filters.timeframe },
  });

  const mints = trendingResponse.data.map(({ mint }) => mint);
  const tokens = await getToken(...mints);

  return { tokens: tokens };
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

  const mints = radarResponse.data.map(({ mint }) => mint);
  const tokens = await getToken(...mints);

  return { tokens: tokens };
};

export const getSurgeTokens = async (params: SurgeFilters) => {
  const response = await api.get<any[]>("/surge", {
    params,
  });

  const tokens: Token[] = response.data.map((r) => mapToken(r));

  return { tokens };
};

export const getTokenCandles = async (filters: TokenCandleFilters) => {
  const response = await api.get<TokenCandle[]>(
    format(`/token/%s/candles`, filters.mint),
    {
      params: { tf: filters.timeframe, limit: filters.limit },
    },
  );

  return response.data;
};
