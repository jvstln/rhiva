"use client";

import { Suspense } from "react";
import { Calendar } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

import { DashboardSlot } from "@/components/layout/DashboardUi";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatCompactCurrency, formatSignedUsd } from "@/lib/finance.util";
import { PortfolioHero } from "@/features/portfolio/components/PortfolioHero";
import { PnlCalendarDialog } from "@/features/portfolio/components/PnlCalendarDialog";
import { PortfolioErrorBanner } from "./PortfolioErrorBanner";
import { TradingPositionsTable } from "@/features/portfolio/components/TradingPositionsTable";
import { QueryState } from "@/components/layout/QueryState";
import type { PortfolioPnl } from "../portfolio.type";

type PortfolioPageProps = {
  /** Token-portfolio query owned by `portfolio/page.tsx`; this component renders it only. */
  query: UseQueryResult<PortfolioPnl, Error>;
};

const PortfolioPage = ({ query }: PortfolioPageProps) => {
  const summaryStats = [
    {
      label: "TOTAL VALUE",
      value: formatCompactCurrency(
        query.data?.summary?.total_value_usd ?? query.data?.total_usd,
      ),
    },
    {
      label: "UNREALIZED PNL",
      value: formatSignedUsd(
        query.data?.summary?.unrealized_pnl_usd ?? query.data?.unrealized_usd,
      ),
    },
    {
      label: "TRADEABLE BALANCE",
      value: formatCompactCurrency(
        query.data?.summary?.tradeable_value_usd ?? query.data?.invested_usd,
      ),
    },
  ];

  const pnlSummary = query.data
    ? {
        value:
          query.data.summary?.pnl_usd ??
          query.data.realized_usd + query.data.unrealized_usd,
        realized: query.data.realized_usd,
        unrealized: query.data.unrealized_usd,
      }
    : undefined;

  const isStatsLoading = query.isPending && query.fetchStatus !== "paused";

  return (
    <DashboardSlot className="mx-auto xl:container">
      <PortfolioHero query={query} />

      <div className="space-y-3">
        <div className="flex gap-3">
          <h2 className="font-bold text-h4 text-white">Trading Positions</h2>
        </div>

        <PortfolioErrorBanner
          query={query}
          message="Failed to load your positions."
        />

        <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {summaryStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-medium text-b-4 text-gray tracking-wide">
                  {stat.label}
                </p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-bold text-h6 text-white">
                    {isStatsLoading ? (
                      <Spinner className="size-5" />
                    ) : (
                      stat.value
                    )}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <PnlCalendarDialog
            tokenPortfolioQuery={query}
            summary={pnlSummary}
          >
            <Button
              className="min-w-24"
              data-require-auth
            >
              <Calendar />
              PnL
            </Button>
          </PnlCalendarDialog>
        </div>
      </div>

      <QueryState
        query={query}
        requireAuth
        getIsEmpty={(q) =>
          q.data.positions.length === 0 && "No trading positions yet"
        }
      >
        {(query) => <TradingPositionsTable positions={query.data.positions} />}
      </QueryState>
    </DashboardSlot>
  );
};

const PortfolioPageWithSuspense = ({ query }: PortfolioPageProps) => {
  return (
    <Suspense>
      <PortfolioPage query={query} />
    </Suspense>
  );
};

export { PortfolioPageWithSuspense as PortfolioPage };
