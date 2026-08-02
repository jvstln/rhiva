"use client";

import { useLiquidityPool } from "../liquidity.hook";
import { BackButton } from "@/components/layout/BackButton";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OrcaTradeRail } from "@/features/liquidity/components/OrcaTradeRail";
import { PositionsPanel } from "@/features/liquidity/components/detail/PositionsPanel";
import { PoolDetailSidebar } from "@/features/liquidity/components/detail/PoolDetailSidebar";
import { MeteoraTradeRail } from "@/features/liquidity/components/MeteoraTradeRail";
import { RaydiumTradeRail } from "@/features/liquidity/components/RaydiumTradeRail";
import { PoolChart } from "@/features/tradeview/components/PoolChart";

export default function LiquidityPoolPage({ id }: { id: string }) {
  const pool = useLiquidityPool(id);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <BackButton />
      <QueryState query={pool}>
        {(query) => (
          <main className="flex min-h-0 flex-1">
            <ScrollArea>
              <PoolDetailSidebar pool={query.data} />
              <ScrollBar showScrollBar />
            </ScrollArea>

            <ScrollArea className={"grow"}>
              <div className="h-[60vh]">
                <PoolChart pool={query.data} />
              </div>
              <PositionsPanel pool={query.data} />
              <ScrollBar showScrollBar />
            </ScrollArea>

            <ScrollArea className={"w-full max-w-92.5 border-l px-2 pr-4"}>
              {query.data.dex === "meteora-dlmm" && (
                <MeteoraTradeRail pool={query.data} />
              )}
              {query.data.dex === "orca-whirlpool" && (
                <OrcaTradeRail pool={query.data} />
              )}
              {query.data.dex === "raydium-clmm" && (
                <RaydiumTradeRail pool={query.data} />
              )}
              <ScrollBar showScrollBar />
            </ScrollArea>
          </main>
        )}
      </QueryState>
    </div>
  );
}
