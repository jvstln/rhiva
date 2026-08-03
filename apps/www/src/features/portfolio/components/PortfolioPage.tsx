"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { capitalize, cn } from "@/lib/utils";
import { PortfolioTab } from "../portfolio.schema";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { Spinner } from "@/components/ui/spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCompactCurrency, formatSignedUsd } from "@/lib/finance.util";
import { PortfolioHero } from "@/features/portfolio/components/PortfolioHero";
import { PnlCalendarDialog } from "@/features/portfolio/components/PnlCalendarDialog";
import { PortfolioErrorBanner } from "./PortfolioErrorBanner";
import { TradingPositionsTable } from "@/features/portfolio/components/TradingPositionsTable";
import { LiquidityPositionsTable } from "@/features/portfolio/components/LiquidityPositionsTable";
import { useLiquidityPositions, useTokenPortfolio } from "../portfolio.hook";
import { useAuth } from "@/hooks";
import { QueryState } from "@/components/layout/QueryState";

const PortfolioPage = () => {
  const searchParams = useSearchParams();
  const activeView = PortfolioTab.catch("liquidityPosition").parse(
    searchParams.get("view"),
  );

  const auth = useAuth();
  const walletAddress = auth.authenticated ? auth.activeWallet.address : "";
  const positions = useLiquidityPositions(walletAddress);
  const tokenPortfolio = useTokenPortfolio(walletAddress);

  const summaryStats =
    activeView === "tradingPosition"
      ? [
          {
            label: "TOTAL VALUE",
            value: formatCompactCurrency(
              tokenPortfolio.data?.total_wallet_worth_usd,
            ),
          },
          {
            label: "UNREALIZED PNL",
            value: formatSignedUsd(tokenPortfolio.data?.total_pnl_usd),
          },
          {
            label: "TRADEABLE BALANCE",
            value: formatCompactCurrency(
              tokenPortfolio.data?.total_invested_usd,
            ),
          },
        ]
      : [
          {
            label: "TOTAL VALUE",
            value: formatCompactCurrency(positions.data?.total_value_usd),
          },
        ];

  const pnlSummary = tokenPortfolio.data
    ? {
        value: tokenPortfolio.data.total_pnl_usd,
        realized: tokenPortfolio.data.realized_pnl_usd,
        unrealized:
          tokenPortfolio.data.total_pnl_usd -
          tokenPortfolio.data.realized_pnl_usd,
      }
    : undefined;

  const statsQuery =
    activeView === "tradingPosition" ? tokenPortfolio : positions;
  const isStatsLoading =
    statsQuery.isPending && statsQuery.fetchStatus !== "paused";

  return (
    <DashboardSlot className="mx-auto xl:container">
      <PortfolioHero query={tokenPortfolio} />

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

        {activeView === "tradingPosition" && (
          <PortfolioErrorBanner
            query={tokenPortfolio}
            message="Failed to load your trading positions."
          />
        )}
        {activeView === "liquidityPosition" && (
          <PortfolioErrorBanner
            query={positions}
            message="Failed to load your liquidity positions."
          />
        )}

        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-6 py-5">
          <div className="flex flex-wrap gap-10">
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
            liquidityType={activeView}
            tokenPortfolioQuery={tokenPortfolio}
            positionsQuery={positions}
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

      {activeView === "tradingPosition" && (
        <QueryState
          query={tokenPortfolio}
          getIsEmpty={(q) =>
            q.data.tokens.length === 0 && "No trading positions yet"
          }
        >
          {(query) => <TradingPositionsTable positions={query.data.tokens} />}
        </QueryState>
      )}
      {activeView === "liquidityPosition" && (
        <QueryState
          query={positions}
          getIsEmpty={(q) =>
            q.data.lp_positions.length === 0 && "No liquidity positions yet"
          }
        >
          {(query) => (
            <LiquidityPositionsTable positions={query.data.lp_positions} />
          )}
        </QueryState>
      )}
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
