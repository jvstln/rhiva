"use client";
import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import type { SearchParams } from "@/types";
import { MarketToolbar } from "./MarketToolbar";
import { MarketStatusBar } from "./MarketStatusBar";
import { MarketView } from "@/features/market/market.schema";
import { TrendingView, WatchlistView } from "./TrendingView";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { useMarketWebsocket } from "../market.ws";

type MarketPageProps = { searchParams: SearchParams };

export function MarketPage({ searchParams }: MarketPageProps) {
  /**
   * Mounts the market WebSocket feeds for every market view (trending, surge,
   * radar, ...) */
  useMarketWebsocket();
  const view = MarketView.parse(searchParams.view);

  return (
    <DashboardSlot className="px-0 pt-0!">
      <MarketStatusBar />
      <MarketToolbar exclude={["radar"]} />
      {view === "watchlist" && <WatchlistView />}
      {view === "trending" && <TrendingView />}
      {view === "radar" && <RadarView />}
      {view === "surge" && <SurgeTable />}

      {view === "top-gainers" && <TrendingView />}
      {view === "latest" && <TrendingView />}
      {view === "stock" && <TrendingView />}
      {view === "stablecoin" && <TrendingView />}
      {/* {view === "pumpLive" && <PumpLiveGrid />} */}
    </DashboardSlot>
  );
}

export function RadarPage({ searchParams }: MarketPageProps) {
  useMarketWebsocket();

  const view = MarketView.parse(searchParams.view);

  return (
    <DashboardSlot className="px-0 pt-0!">
      <MarketStatusBar />
      <MarketToolbar include={["watchlist", "radar"]} />
      {view === "watchlist" ? <WatchlistView /> : <RadarView />}
    </DashboardSlot>
  );
}
