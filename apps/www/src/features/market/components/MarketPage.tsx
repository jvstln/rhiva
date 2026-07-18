"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { MarketView } from "@/features/market/market.schema";
import { MarketStatusBar } from "./MarketStatusBar";
import { MarketToolbar } from "./MarketToolbar";
import { PumpLiveGrid } from "./PumpLiveView";
import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import { TrendingTable } from "./TrendingView";

const MarketPage = () => {
  const searchParams = useSearchParams();
  const view = MarketView.parse(searchParams.get("view"));

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
};

const MarketPageWithSuspense = () => (
  <Suspense>
    <MarketPage />
  </Suspense>
);

export { MarketPageWithSuspense as MarketPage };
