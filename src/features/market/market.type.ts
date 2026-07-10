import type { BondingCurve, RadarColumns, Timeframe } from "./market.schema";

type Sort = "asc" | "desc" | null;

export type MarketState = {
  radarFilters: RadarFilters;
  setRadarFilters: (columns: Partial<RadarFilters>) => void;

  trendingFilters: TrendingFilters;
  setTrendingFilters: (filters: Partial<TrendingFilters>) => void;

  pumpLiveSettings: {
    sort: Record<"marketCap" | "time", Sort>;
    setSort: (
      columns:
        | Partial<MarketState["pumpLiveSettings"]["sort"]>
        | ((
            sort: MarketState["pumpLiveSettings"]["sort"],
          ) => MarketState["pumpLiveSettings"]["sort"]),
    ) => void;
  };

  surgeFilters: SurgeFilters;
  setSurgeFilters: (filters: Partial<SurgeFilters>) => void;
};

export type TrendingFilters = {
  timeframe: Timeframe;
  quickSell: number | null;
  quickBuy: number | null;
  preset: BondingCurve;
};

export type RadarFilters = Record<
  RadarColumns,
  {
    search: string;
    bondingCurve: BondingCurve;
    quickBuy: number | null;
    quickSell: number | null;
  }
>;

export type SurgeFilters = {
  timeframe: Timeframe;
  mcMin: number | null;
  mcMax: number | null;
  quickBuy: number | null;
  preset: BondingCurve;
};

export * from "./market.token.type";
