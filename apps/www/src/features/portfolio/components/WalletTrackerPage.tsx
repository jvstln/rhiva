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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
        className="flex flex-col gap-4"
      >
        <div className="border-border/60 border-b">
          <TabsList
            variant="line"
            className="flex h-auto w-max items-center gap-1 bg-transparent p-0"
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "cursor-pointer rounded-none border-transparent border-b-2 px-3 py-2 font-medium text-b-3 transition-colors",
                  "text-gray hover:text-white data-active:border-primary data-active:text-white",
                )}
              >
                {getTabLabel(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          <TabsContent
            value="Balances"
            className="mt-0 outline-none"
          >
            <BalancesTable tokens={balanceData?.tokens} />
          </TabsContent>

          <TabsContent
            value="Positions"
            className="mt-0 outline-none"
          >
            <TradingPositionsTable positions={pnlData?.positions ?? []} />
          </TabsContent>

          <TabsContent
            value="Trades"
            className="mt-0 outline-none"
          >
            <TradesTable trades={tradesData} />
          </TabsContent>

          <TabsContent
            value="Transfers"
            className="mt-0 outline-none"
          >
            <TransfersTable transfers={transfersData} />
          </TabsContent>

          <TabsContent
            value="Funding"
            className="mt-0 outline-none"
          >
            <FundingTab funding={fundingData} />
          </TabsContent>

          <TabsContent
            value="Tips"
            className="mt-0 outline-none"
          >
            <TipsTab fees={feesData} />
          </TabsContent>
        </div>
      </Tabs>
    </DashboardSlot>
  );
};
