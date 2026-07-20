import { DashboardSlot } from "@/components/layout/DashboardUi";
import { MarketView } from "@/features/market/market.schema";
import type { SearchParams } from "@/types";
import { MarketStatusBar } from "./MarketStatusBar";
import { MarketToolbar } from "./MarketToolbar";
import { PumpLiveGrid } from "./PumpLiveView";
import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import { TrendingTable } from "./TrendingView";

type MarketPageProps = { searchParams: SearchParams };

export async function MarketPage({ searchParams }: MarketPageProps) {
  const view = MarketView.parse(searchParams.view);

  return (
    <DashboardSlot className="px-0 pt-0">
      <MarketStatusBar />
      <MarketToolbar />

      {view === "watchlist" && <TrendingTable />}
      {view === "trending" && <TrendingTable />}
      {view === "surge" && <SurgeTable />}
      {view === "pumpLive" && <PumpLiveGrid />}
      {view === "radar" && <RadarView />}
    </DashboardSlot>
  );
}
