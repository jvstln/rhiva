"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { capitalize, cn } from "@/lib/utils";
import { PortfolioTab } from "../portfolio.schema";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { Button, buttonVariants } from "@/components/ui/button";
import { PORTFOLIO_SUMMARY } from "@/components/ui/data/portfolio-data";
import { PortfolioHero } from "@/features/portfolio/components/PortfolioHero";
import { PnlCalendarDialog } from "@/features/portfolio/components/PnlCalendarDialog";
import { TradingPositionsTable } from "@/features/portfolio/components/TradingPositionsTable";
import { LiquidityPositionsTable } from "@/features/portfolio/components/LiquidityPositionsTable";

const PortfolioPage = () => {
  const searchParams = useSearchParams();
  const activeView = PortfolioTab.catch("liquidityPosition").parse(
    searchParams.get("view"),
  );

  return (
    <DashboardSlot className="mx-auto xl:container">
      <PortfolioHero />

      <div className="space-y-3">
        <div className="flex gap-3">
          {PortfolioTab.options.map((view) => (
            <Link
              key={view}
              href={`?view=${view}`}
              className={cn(buttonVariants({ variant: "outline" }))}
              data-active={activeView === view ? true : undefined}
            >
              {capitalize(view)}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-6 py-5">
          <div className="flex flex-wrap gap-10">
            {[
              {
                label: "TOTAL VALUE",
                value: PORTFOLIO_SUMMARY.totalValue,
                change: PORTFOLIO_SUMMARY.totalValueChange,
                show: true,
              },
              {
                label: "UNREALIZED PNL",
                value: PORTFOLIO_SUMMARY.unrealizedPnl,
                show: activeView === "tradingPosition",
              },
              {
                label: "TRADEABLE BALANCE",
                value: PORTFOLIO_SUMMARY.tradeableBalance,
                show: activeView === "tradingPosition",
              },
            ].map(
              (stat) =>
                stat.show && (
                  <div key={stat.label}>
                    <p className="font-medium text-b-4 text-gray tracking-wide">
                      {stat.label}
                    </p>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="font-bold text-h6 text-white">
                        {stat.value}
                      </span>
                      {stat.change && (
                        <span
                          className={cn(
                            "font-medium text-b-3",
                            stat.change.startsWith("-")
                              ? "text-down"
                              : "text-up",
                          )}
                        >
                          {stat.change}
                        </span>
                      )}
                    </p>
                  </div>
                ),
            )}
          </div>
          <PnlCalendarDialog liquidityType={activeView}>
            <Button className="min-w-24">
              <Calendar />
              PnL
            </Button>
          </PnlCalendarDialog>
        </div>
      </div>

      {activeView === "tradingPosition" && <TradingPositionsTable />}
      {activeView === "liquidityPosition" && <LiquidityPositionsTable />}
    </DashboardSlot>
  );
};

const PortfolioPageWithSuspense = () => {
  return (
    <Suspense>
      <PortfolioPage />
    </Suspense>
  );
};

export { PortfolioPageWithSuspense as PortfolioPage };
