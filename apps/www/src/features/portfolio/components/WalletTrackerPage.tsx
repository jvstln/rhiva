"use client";

import { useState } from "react";
import {
  usePortfolioBalance,
  usePortfolioFees,
  usePortfolioFunding,
  usePortfolioHistory,
  usePortfolioPerformance,
  usePortfolioTrades,
  usePortfolioTransfers,
  usePortfolioWebSocket,
  useTokenPortfolio,
} from "../portfolio.hook";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioCharts } from "./PortfolioCharts";
import { BalancesTable } from "./BalancesTable";
import { TradingPositionsTable } from "./TradingPositionsTable";
import { TradesTable } from "./TradesTable";
import { TransfersTable } from "./TransfersTable";
import { FundingTab } from "./FundingTab";
import { TipsTab } from "./TipsTab";
import { DashboardSlot } from "@/components/layout/DashboardUi";

const TABS = [
  "Positions",
  "Balances",
  "Trades",
  "Transfers",
  "Funding",
  "Tips",
] as const;

type TabKey = (typeof TABS)[number];

type WalletTrackerPageProps = {
  address: string;
};

export const WalletTrackerPage = ({ address }: WalletTrackerPageProps) => {
  usePortfolioWebSocket(address);

  const [activeTab, setActiveTab] = useState<TabKey>("Balances");

  const pnlQuery = useTokenPortfolio(address);
  const balanceQuery = usePortfolioBalance(address);
  const historyQuery = usePortfolioHistory(address);
  const performanceQuery = usePortfolioPerformance(address);
  const tradesQuery = usePortfolioTrades(address);
  const transfersQuery = usePortfolioTransfers(address);
  const fundingQuery = usePortfolioFunding(address);
  const feesQuery = usePortfolioFees(address);

  const pnlData = pnlQuery.data;
  const balanceData = balanceQuery.data;
  const historyData = historyQuery.data;
  const perfData = performanceQuery.data;
  const tradesData = tradesQuery.data;
  const transfersData = transfersQuery.data;
  const fundingData = fundingQuery.data;
  const feesData = feesQuery.data;

  const positionsCount = pnlData?.positions?.length ?? 200;
  const balancesCount = balanceData?.tokens?.length ?? 1706;
  const tradesCount = tradesData?.length ?? 99;
  const transfersCount = transfersData?.length ?? 4;

  const getTabLabel = (tab: TabKey) => {
    switch (tab) {
      case "Positions":
        return `Positions ${positionsCount}`;
      case "Balances":
        return `Balances ${balancesCount}`;
      case "Trades":
        return `Trades ${tradesCount}`;
      case "Transfers":
        return transfersCount > 0 ? `Transfers ${transfersCount}` : "Transfers";
      case "Funding":
        return "Funding";
      case "Tips":
        return "Tips";
    }
  };

  return (
    <DashboardSlot className="mx-auto flex flex-col gap-6 xl:container">
      {/* 1. Header Bar */}
      <PortfolioHeader
        wallet={address}
        pnl={pnlData}
        solBalance={balanceData?.sol?.ui_amount}
      />

      {/* 2. Top 3 Charts / Cards */}
      <PortfolioCharts
        history={historyData}
        performance={perfData}
      />

      {/* 3. Navigation Tabs */}
      <div className="flex flex-col gap-4">
        <div className="border-border/60 border-b">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer whitespace-nowrap border-b-2 py-3 font-semibold text-xs transition-colors ${
                    isActive
                      ? "border-white text-white"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-white/80"
                  }`}
                >
                  {getTabLabel(tab)}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          {activeTab === "Balances" && (
            <BalancesTable tokens={balanceData?.tokens} />
          )}

          {activeTab === "Positions" && (
            <TradingPositionsTable positions={pnlData?.positions ?? []} />
          )}

          {activeTab === "Trades" && <TradesTable trades={tradesData} />}

          {activeTab === "Transfers" && (
            <TransfersTable transfers={transfersData} />
          )}

          {activeTab === "Funding" && <FundingTab funding={fundingData} />}

          {activeTab === "Tips" && <TipsTab fees={feesData} />}
        </div>
      </div>
    </DashboardSlot>
  );
};
