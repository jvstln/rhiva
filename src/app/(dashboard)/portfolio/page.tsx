"use client";

import { useState } from "react";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PositionStatsBar } from "@/components/portfolio/PositionStatsBar";
import { PositionsTable } from "@/components/portfolio/PositionsTable";

export type PortfolioTab = "Trading Position" | "Liquidity Positions";

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>("Trading Position");

  return (
    <DashboardSlot>
      <PortfolioHero />
      <PositionStatsBar activeTab={activeTab} onChangeTab={setActiveTab} />
      <PositionsTable activeTab={activeTab} />
    </DashboardSlot>
  );
}
