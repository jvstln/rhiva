"use client";

import type { TokenQuery, RadarQueries } from "../market.hook";
import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import { MarketToolbar } from "./MarketToolbar";
import { MarketStatusBar } from "./MarketStatusBar";
import { TrendingView, WatchlistView } from "./TrendingView";
import type { MarketView } from "@/features/market/market.schema";
import { DashboardSlot } from "@/components/layout/DashboardUi";

/**
 * Presentational market views. The route pages (`market/page.tsx`,
 * `radar/page.tsx`) fetch all data and pass it in as `queries` — these
 * components never call data hooks themselves.
 */

/** One query result per market view, supplied by `market/page.tsx`. */
export type MarketQueries = {
  trending: TokenQuery;
  watchlist: TokenQuery;
  radar: RadarQueries;
  surge: TokenQuery;
};

const TRENDING_VIEWS: readonly MarketView[] = [
  "latest",
  "trending",
  "top-gainers",
  "stock",
  "stablecoin",
];

type MarketPageProps = {
  view: MarketView;
  queries: MarketQueries;
};

export function MarketPage({ view, queries }: MarketPageProps) {
  return (
    <DashboardSlot className="px-0 pt-0!">
      <MarketStatusBar />
      <MarketToolbar exclude={["radar"]} />
      {TRENDING_VIEWS.includes(view) && (
        <TrendingView query={queries.trending} />
      )}
      {view === "watchlist" && <WatchlistView query={queries.watchlist} />}
      {view === "radar" && <RadarView queries={queries.radar} />}
      {view === "surge" && <SurgeTable query={queries.surge} />}
    </DashboardSlot>
  );
}

type RadarPageProps = {
  view: MarketView;
  queries: Pick<MarketQueries, "radar" | "watchlist">;
};

export function RadarPage({ view, queries }: RadarPageProps) {
  return (
    <DashboardSlot className="px-0 pt-0!">
      <MarketStatusBar />
      <MarketToolbar include={["watchlist", "radar"]} />
      {view === "watchlist" ? (
        <WatchlistView query={queries.watchlist} />
      ) : (
        <RadarView queries={queries.radar} />
      )}
    </DashboardSlot>
  );
}
