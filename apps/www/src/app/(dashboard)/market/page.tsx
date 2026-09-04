"use client";

import { use } from "react";

import { MarketView } from "@/features/market/market.schema";
import { useMarketWebsocket } from "@/features/market/market.ws";
import { useMarketStore } from "@/features/market/market.store";
import {
  useMarketFiltersFromSearchParams,
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

/**
 * Market page data owner.
 *
 * This is the ONLY place that fetches market data. It renders `<MarketPage>`
 * (pure UI) and passes every query result to it as props.
 * To integrate a real API, edit the data functions in `market.api.ts` — the
 * component tree below is just plumbing and never needs to change.
 *
 * The `enabled` flags gate each query so only the ACTIVE view's data is
 * fetched (e.g. the surge list only loads while the surge tab is open).
 */
export default function MarketRoute({ searchParams }: PageProps<"/market">) {
  const params = use(searchParams);

  useMarketWebsocket();
  useMarketFiltersFromSearchParams(params);

  const view = MarketView.parse(params.view);

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
      queries={{
        trending: trendingQuery,
        watchlist: watchlistQuery,
        radar: radarQueries,
        surge: surgeQuery,
      }}
    />
  );
}
