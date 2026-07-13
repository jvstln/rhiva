"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MarketView } from "@/features/market/market.schema";
import { MarketToolbar } from "./MarketToolbar";
import { PumpLiveGrid } from "./PumpLiveView";
import { RadarView } from "./RadarView";
import { SurgeTable } from "./SurgeView";
import { TrendingTable } from "./TrendingView";

const MarketPage = () => {
  const searchParams = useSearchParams();
  const view = MarketView.parse(searchParams.get("view"));

  return (
    <div className="mx-auto flex size-full min-h-0 flex-1 flex-col xl:container">
      <MarketToolbar />

      {view === "watchlist" && <TrendingTable />}
      {view === "trending" && <TrendingTable />}
      {view === "surge" && <SurgeTable />}
      {view === "pumpLive" && <PumpLiveGrid />}
      {view === "radar" && <RadarView />}
    </div>
  );
};

const MarketPageWithSuspense = () => (
  <Suspense>
    <MarketPage />
  </Suspense>
);

export { MarketPageWithSuspense as MarketPage };
