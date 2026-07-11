import { api } from "@/lib/api";
import type {
  MemeTokenResponseData,
  RadarFilters,
  SurgeFilters,
  TrendingFilters,
  TrendingTokenResponseData,
} from "./market.type";

export const getTrendingTokens = async (filters: TrendingFilters) => {
  const response = await api.get<{ data: TrendingTokenResponseData }>(
    "/defi/v3/token/list",
    {
      params: {
        sort_by: `volume_${filters.timeframe}_usd`,
        sort_type: "desc",
        min_liquidity: "1000", // tunable
        [`min_volume_${filters.timeframe}_usd`]: "5000",
        [`min_trade_${filters.timeframe}_count`]: "10",
        min_holder: "30",
      },
    },
  );
  return response.data.data;
};

export const getRadarFreshTokens = async (_filters: RadarFilters["fresh"]) => {
  const response = await api.get<{ data: MemeTokenResponseData }>(
    "/defi/v3/token/meme/list",
    {
      url: "/defi/v3/token/list",
      params: {
        sort_by: "creation_time",
        sort_type: "desc",
        graduated: false,
        max_progress_percent: 30, // tunable
      },
    },
  );
  return response.data.data;
};

export const getRadarHeatedUpTokens = async (
  _filters: RadarFilters["heatingUp"],
) => {
  const response = await api.get<{ data: MemeTokenResponseData }>(
    "/defi/v3/token/meme/list",
    {
      url: "/defi/v3/token/list",
      params: {
        sort_by: "trade_5m_count", // or volume_5m_usd — pick your momentum metric
        sort_type: "desc",
        graduated: false,
        min_progress_percent: 30, // past "fresh" territory
        max_progress_percent: 99,
        min_trade_5m_count: 10,
      },
    },
  );
  return response.data.data;
};

export const getRadarGraduatedTokens = async (
  _filters: RadarFilters["graduated"],
) => {
  const response = await api.get<{ data: MemeTokenResponseData }>(
    "/defi/v3/token/meme/list",
    {
      url: "/defi/v3/token/list",
      params: {
        sort_by: "graduated_time",
        sort_type: "desc",
        graduated: true,
      },
    },
  );
  return response.data.data;
};

export const getSurgeGraduatedTokens = async (filters: SurgeFilters) => {
  const response = await api.get<{ data: MemeTokenResponseData }>(
    "/defi/v3/token/meme/list",
    {
      url: "/defi/v3/token/list",
      params: {
        graduated: true,
        sort_by: `price_change_${filters.timeframe}_percent`,
        sort_type: "desc",
        min_liquidity: "2000",
        min_holder: "30",
        [`min_trade_${filters.timeframe}_count`]: "15",
        min_market_cap: filters.mcMin,
        max_market_cap: filters.mcMax,
      },
    },
  );
  return response.data.data;
};
