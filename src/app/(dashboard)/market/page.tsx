"use client";

import { useState } from "react";
import { MarketColumn } from "@/components/market/MarketColumn";
import {
  MarketToolbar,
  type MarketToolbarFilter,
} from "@/components/market/MarketToolbar";
import { PumpLiveGrid } from "@/components/market/PumpLiveView";
import SurgeTable from "@/components/market/SurgeView";
import { TrendingTable } from "@/components/market/TrendingView";
import {
  FRESH_TOKENS,
  GRADUATED_TOKENS,
  HEATING_TOKENS,
} from "@/data/market-data";

export default function MarketPage() {
  const [filters, setFilters] = useState<MarketToolbarFilter>({
    view: "Trending",
    timeframe: "1h",
    priority: "P1",
    hideSmall: false,
  });

  return (
    <div>
      <MarketToolbar filters={filters} setFilters={setFilters} />

      {filters.view === "Watchlist" && <TrendingTable />}
      {filters.view === "Trending" && <TrendingTable />}
      {filters.view === "Surge" && <SurgeTable />}
      {filters.view === "Pump Live" && <PumpLiveGrid />}

      {filters.view === "Radar" && (
        <main className="flex flex-1">
          <MarketColumn title="Fresh" tokens={FRESH_TOKENS} />
          <MarketColumn
            title="Heating Up"
            tokens={HEATING_TOKENS}
            showMcToggle
          />
          <MarketColumn title="Graduated" tokens={GRADUATED_TOKENS} />
        </main>
      )}
    </div>
  );
}
