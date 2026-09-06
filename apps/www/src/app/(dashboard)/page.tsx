"use client";

import type { MarketView } from "@/features/market/market.schema";
import { useMarketStore } from "@/features/market/market.store";
import {
  useRadarTokens,
  useSurgeTokens,
  useTrendingTokens,
  useWatchlistTokens,
} from "@/features/market/market.hook";
import { MarketPage } from "@/features/market/components/MarketPage";

const TRENDING_VIEWS: readonly MarketView[] = [
  "latest",
  "trending",
  "top-gainers",
  "stock",
  "stablecoin",
];

const isTrendingView = (view: MarketView): boolean =>
  TRENDING_VIEWS.includes(view);

export default function RootMarketPage() {
  const view = useMarketStore((state) => state.activeView);
  const setView = useMarketStore((state) => state.setActiveView);

  const trendingFilters = useMarketStore((state) => state.trendingFilters);
  const surgeFilters = useMarketStore((state) => state.surgeFilters);
  const radarFilters = useMarketStore((state) => state.radarFilters);
  const watchlistItems = useMarketStore((state) => state.watchlist.items);

  const showTrending = isTrendingView(view);
  const showWatchlist = view === "watchlist";
  const showRadar = view === "radar";
  const showSurge = view === "surge";

  const trendingQuery = useTrendingTokens(trendingFilters, {
    enabled: showTrending,
    view,
  });
  const watchlistQuery = useWatchlistTokens(watchlistItems, {
    enabled: showWatchlist,
  });
  const radarQueries = {
    fresh: useRadarTokens(
      { ...radarFilters.fresh, type: "fresh" },
      { enabled: showRadar },
    ),
    heatingUp: useRadarTokens(
      { ...radarFilters.heatingUp, type: "heatingUp" },
      { enabled: showRadar },
    ),
    graduated: useRadarTokens(
      { ...radarFilters.graduated, type: "graduated" },
      { enabled: showRadar },
    ),
  };
  const surgeQuery = useSurgeTokens(surgeFilters, { enabled: showSurge });

  return (
    <MarketPage
      view={view}
      onViewChange={setView}
      queries={{
        trending: trendingQuery,
        watchlist: watchlistQuery,
        radar: radarQueries,
        surge: surgeQuery,
      }}
    />
  );
}
