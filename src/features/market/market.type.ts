import type { QuickSell, RadarColumns } from "./market.schema";

type Sort = "asc" | "desc" | null;

export type MarketState = {
  radarSettings: {
    quickSell: {
      [k in RadarColumns]: QuickSell;
    };
    setQuickSell: (
      columns: Partial<Record<RadarColumns, Partial<QuickSell>>>,
    ) => void;
  };
  trendingSettings: {
    quickSell: QuickSell;
    setQuickSell: (setting: Partial<QuickSell>) => void;
    quickBuy: number;
  };
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
};

export * from "./market.token.type";
