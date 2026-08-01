import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import type { SearchParams } from "@/types";
import { PumpLiveGrid } from "./PumpLiveView";
import { MarketToolbar } from "./MarketToolbar";
import { MarketStatusBar } from "./MarketStatusBar";
import { MarketView } from "@/features/market/market.schema";
import { TrendingView, WatchlistView } from "./TrendingView";
import { DashboardSlot } from "@/components/layout/DashboardUi";

type MarketPageProps = { searchParams: SearchParams };

export async function MarketPage({ searchParams }: MarketPageProps) {
  const view = MarketView.parse(searchParams.view);

  return (
    <DashboardSlot className="px-0 pt-0">
      <MarketStatusBar />
      <MarketToolbar />

      {view === "watchlist" && <WatchlistView />}
      {view === "trending" && <TrendingView />}
      {view === "surge" && <SurgeTable />}
      {view === "pumpLive" && <PumpLiveGrid />}
      {view === "radar" && <RadarView />}
    </DashboardSlot>
  );
}
