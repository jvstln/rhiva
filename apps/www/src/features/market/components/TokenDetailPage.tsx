import { useState } from "react";
import type { TokenDetail } from "@rhivadotfun/dataapi";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TokenDetailHeader } from "./TokenDetailHeader";
import type { TokenDetailFilters } from "../market.type";
import { BackButton } from "@/components/layout/BackButton";
import { TokenDetailTradesTable } from "./TokenDetailTradesTable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TokenDetailDataSections } from "./TokenDetailDataSections";
import { TokenChart } from "@/features/tradeview/components/TokenChart";
import { TokenDetailTimeframeStats } from "./TokenDetailTimeframeStats";
import { TokenDetailStatsGrid } from "@/features/market/components/TokenDetailStatsGrid";
import { TokenDetailTradePanel } from "@/features/market/components/TokenDetailTradePanel";
import { useTokenWebSocket } from "../market.ws";

type TokenDetailPageProps = { token: TokenDetail };

const TABLE_TABS = [
  "Trades",
  "Positions",
  "Orders",
  "Holders",
  "Top Traders",
  "Tracking",
  "DCA",
  "Liquidity Pool",
  "Dev Token",
] as const;

export const TokenDetailPage = ({ token }: TokenDetailPageProps) => {
  useTokenWebSocket(token.mint);
  const [activeTable, setActiveTable] =
    useState<(typeof TABLE_TABS)[number]>("Trades");
  const [filters, setFilters] = useState<TokenDetailFilters>({
    timeframe: "5m",
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const resolvedFilters = { ...filters, ...newFilters };
    setFilters(resolvedFilters);
  };

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-var(--header-height))] lg:flex-row">
      <ScrollArea className="min-h-0 w-full min-w-0 lg:h-full lg:flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <BackButton />
          <TokenDetailHeader token={token} />

          <div className="min-h-[60vh]">
            <TokenChart token={token} />
          </div>

          {/* Tables */}
          <div>
            <div className="sticky top-0 z-1 bg-background px-4 py-2">
              <ScrollArea
                className="w-full"
                showIndicator
              >
                <div
                  className="flex w-max gap-2"
                  role="tablist"
                  aria-label="Token data tables"
                >
                  {TABLE_TABS.map((tab) => (
                    <Button
                      key={tab}
                      variant="ghost"
                      size="sm"
                      data-active={activeTable === tab}
                      onClick={() => setActiveTable(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
                <ScrollBar
                  orientation="horizontal"
                  showIndicator={false}
                />
              </ScrollArea>
            </div>

            {activeTable === "Trades" && (
              <TokenDetailTradesTable mint={token.mint} />
            )}
          </div>
        </div>
        <ScrollBar
          orientation="vertical"
          showIndicator
        />
      </ScrollArea>

      {/* Right rail */}
      <aside className="w-full shrink-0 border-border/70 border-t lg:w-95 lg:border-t-0 lg:border-l">
        <ScrollArea className="lg:h-full">
          <TokenDetailTimeframeStats
            token={token}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <Separator />
          <TokenDetailTradePanel token={token} />
          <Separator />
          <TokenDetailStatsGrid token={token} />
          <Separator />
          <TokenDetailDataSections token={token} />
        </ScrollArea>
      </aside>
    </div>
  );
};
