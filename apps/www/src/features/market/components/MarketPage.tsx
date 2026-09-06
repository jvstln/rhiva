"use client";

import type { TokenQuery, RadarQueries } from "../market.hook";
import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import { MarketToolbar } from "./MarketToolbar";
import { MarketStatusBar } from "./MarketStatusBar";
import { TrendingView, WatchlistView } from "./TrendingView";
import type { MarketView } from "@/features/market/market.schema";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { Tabs, TabsContent } from "@/components/ui/tabs";

/**
 * Presentational market views. The route pages (`page.tsx`,
 * `radar/page.tsx`) fetch all data and pass it in as `queries` — these
 * components render tab views with no server-side suspense or comparison reloading.
 */

/** One query result per market view. */
export type MarketQueries = {
  trending: TokenQuery;
  watchlist: TokenQuery;
  radar: RadarQueries;
  surge: TokenQuery;
};

type MarketPageProps = {
  view: MarketView;
  onViewChange?: (view: MarketView) => void;
  queries: MarketQueries;
};

export function MarketPage({ view, onViewChange, queries }: MarketPageProps) {
  return (
    <DashboardSlot className="px-0 pt-0!">
      <Tabs
        value={view}
        onValueChange={(val) => onViewChange?.(val as MarketView)}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <MarketStatusBar />
        <MarketToolbar exclude={["radar"]} />

        <TabsContent
          value="trending"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <TrendingView
            query={queries.trending}
            view="trending"
          />
        </TabsContent>

        <TabsContent
          value="latest"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <TrendingView
            query={queries.trending}
            view="latest"
          />
        </TabsContent>

        <TabsContent
          value="top-gainers"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <TrendingView
            query={queries.trending}
            view="top-gainers"
          />
        </TabsContent>

        <TabsContent
          value="stock"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <TrendingView
            query={queries.trending}
            view="stock"
          />
        </TabsContent>

        <TabsContent
          value="stablecoin"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <TrendingView
            query={queries.trending}
            view="stablecoin"
          />
        </TabsContent>

        <TabsContent
          value="watchlist"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <WatchlistView query={queries.watchlist} />
        </TabsContent>

        <TabsContent
          value="radar"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <RadarView queries={queries.radar} />
        </TabsContent>

        <TabsContent
          value="surge"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <SurgeTable query={queries.surge} />
        </TabsContent>
      </Tabs>
    </DashboardSlot>
  );
}

type RadarPageProps = {
  view: MarketView;
  onViewChange?: (view: MarketView) => void;
  queries: Pick<MarketQueries, "radar" | "watchlist">;
};

export function RadarPage({ view, onViewChange, queries }: RadarPageProps) {
  return (
    <DashboardSlot className="px-0 pt-0!">
      <Tabs
        value={view}
        onValueChange={(val) => onViewChange?.(val as MarketView)}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <MarketStatusBar />
        <MarketToolbar include={["watchlist", "radar"]} />

        <TabsContent
          value="radar"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <RadarView queries={queries.radar} />
        </TabsContent>

        <TabsContent
          value="watchlist"
          className="mt-0 min-h-0 flex-1 outline-none"
        >
          <WatchlistView query={queries.watchlist} />
        </TabsContent>
      </Tabs>
    </DashboardSlot>
  );
}
