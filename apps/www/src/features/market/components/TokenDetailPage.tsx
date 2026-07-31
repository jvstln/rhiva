import { BackButton } from "@/components/layout/BackButton";
import { TradesTable } from "@/components/token-detail/TradesTable";
import type { Token } from "../market.token.type";
import { TokenChart } from "@/features/tradeview/components/TokenChart";
import { TokenDetailHeader } from "./TokenDetailHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { mapToken } from "../market.util";
import type { TokenDetailFilters } from "../market.type";
import { TokenDetailTimeframeStats } from "./TokenDetailTimeframeStats";
import { TokenDetailStatsGrid } from "@/features/market/components/TokenDetailStatsGrid";
import { TokenDetailTradePanel } from "@/features/market/components/TokenDetailTradePanel";
import { Separator } from "@/components/ui/separator";
import { TokenDetailDataSections } from "./TokenDetailDataSections";

type TokenDetailPageProps = { token: Token };

export const TokenDetailPage = ({
  token: initialToken,
}: TokenDetailPageProps) => {
  const [filters, setFilters] = useState<TokenDetailFilters>({});
  const [token, setToken] = useState(initialToken);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const resolvedFilters = { ...filters, ...newFilters };
    setFilters(resolvedFilters);
    setToken(mapToken(token.original, resolvedFilters));
  };

  return (
    <div className="flex">
      <ScrollArea className="h-full min-h-0 w-full min-w-0">
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <BackButton />
          <TokenDetailHeader token={token} />
          <TokenChart token={token} />
          <TradesTable token={token} />
        </div>
        <ScrollBar
          orientation="vertical"
          showIndicator
          showScrollBar={false}
        />
      </ScrollArea>

      {/* Right rail */}
      <aside className="w-95 shrink-0 border-border/70 border-l">
        <ScrollArea className="h-full">
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
