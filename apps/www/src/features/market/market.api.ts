import { api } from "@/lib/api";
import type {
  RadarFilters,
  SurgeFilters,
  Token,
  TokenCandle,
  TokenCandleFilters,
  TrendingFilters,
} from "./market.type";
import { mapToken } from "./market.util";

export const getToken = async (mint: string) => {
  const response = await api.get(`/token/${mint}`);
  return mapToken(response.data);
};

export const getTrendingTokens = async (
  filters: TrendingFilters,
): Promise<{ tokens: Token[] }> => {
  const trendingResponse = await api.get<
    Array<{ mint: string; score: number }>
  >("/trending", {
    params: { window: filters.timeframe, limit: 3 },
  });

  const tokens = (
    await Promise.allSettled(
      trendingResponse.data.map(({ mint }) => {
        return getToken(mint);
      }),
    )
  )
    .map((p) => {
      if (p.status === "rejected") return null;
      return p.value;
    })
    .filter((token) => token !== null);

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
      limit: 3,
    },
  });

  const tokens = (
    await Promise.allSettled(
      radarResponse.data.map(({ mint }) => {
        return getToken(mint);
      }),
    )
  )
    .map((p) => {
      if (p.status === "rejected") return null;
      return p.value;
    })
    .filter((token) => token !== null);

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
    `/token/${filters.mint}/candles`,
    {
      params: { tf: filters.timeframe, limit: filters.limit },
    },
  );

  return response.data;
};
