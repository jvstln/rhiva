import type {
  Preset,
  RadarColumns,
  SurgeFilters,
  SurgeFiltersInput,
  Timeframe,
} from "./market.schema";

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

  surgeFilters: SurgeFiltersInput & {
    timeframe: Timeframe;
    quickBuy: number | null;
    preset: Preset;
  };
  setSurgeFilters: (filters: Partial<MarketState["surgeFilters"]>) => void;

  watchlist: {
    items: Array<string>;
    add: (mint: string) => void;
    remove: (mint: string) => void;
    toggle: (mint: string) => void;
  };
};

export type TrendingFilters = {
  timeframe: Timeframe;
  quickSell: number | null;
  quickBuy: number | null;
  preset: Preset;
};

export type RadarFilters = Record<
  RadarColumns,
  {
    search: string;
    bondingCurve: Preset;
    quickBuy: number | null;
    quickSell: number | null;
  }
>;

export type * from "./market.token.type";
export type * from "./market.schema";
