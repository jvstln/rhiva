"use client";

import { useMarketStore } from "@/features/market/market.store";
import {
  useRadarTokens,
  useWatchlistTokens,
} from "@/features/market/market.hook";
import { RadarPage } from "@/features/market/components/MarketPage";

export default function RadarRoute() {
  const activeView = useMarketStore((state) => state.activeView);
  const setActiveView = useMarketStore((state) => state.setActiveView);
  const view = activeView === "watchlist" ? "watchlist" : "radar";
  const showWatchlist = view === "watchlist";

  const radarFilters = useMarketStore((state) => state.radarFilters);
  const watchlistItems = useMarketStore((state) => state.watchlist.items);

  const radarQueries = {
    fresh: useRadarTokens(
      { ...radarFilters.fresh, type: "fresh" },
      { enabled: !showWatchlist },
    ),
    heatingUp: useRadarTokens(
      { ...radarFilters.heatingUp, type: "heatingUp" },
      { enabled: !showWatchlist },
    ),
    graduated: useRadarTokens(
      { ...radarFilters.graduated, type: "graduated" },
      { enabled: !showWatchlist },
    ),
  };
  const watchlistQuery = useWatchlistTokens(watchlistItems, {
    enabled: showWatchlist,
  });

  return (
    <RadarPage
      view={view}
      onViewChange={setActiveView}
      queries={{ radar: radarQueries, watchlist: watchlistQuery }}
    />
  );
}
