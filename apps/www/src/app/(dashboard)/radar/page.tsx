"use client";

import { use } from "react";

import { MarketView } from "@/features/market/market.schema";
import { useMarketWebsocket } from "@/features/market/market.ws";
import { useMarketStore } from "@/features/market/market.store";
import {
  useMarketFiltersFromSearchParams,
  useRadarTokens,
  useWatchlistTokens,
} from "@/features/market/market.hook";
import { RadarPage } from "@/features/market/components/MarketPage";

export default function RadarRoute({ searchParams }: PageProps<"/radar">) {
  const params = use(searchParams);

  useMarketWebsocket();
  useMarketFiltersFromSearchParams(params);

  const view = MarketView.parse(params.view);
  const showWatchlist = view === "watchlist";

  /**
   * Radar page data owner — same pattern as `market/page.tsx`: all fetching
   * happens here, `<RadarPage>` is pure UI. Radar columns are fetched only
   * while the radar view is active; the watchlist only while it isn't.
   */
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
      queries={{ radar: radarQueries, watchlist: watchlistQuery }}
    />
  );
}
