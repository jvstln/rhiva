"use client";

import { useLiquidityPool } from "../liquidity.hook";
import { BackButton } from "@/components/layout/BackButton";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OrcaTradeRail } from "@/features/liquidity/components/OrcaTradeRail";
import { PoolDetailSidebar } from "@/components/liquidity-detail/PoolDetailSidebar";
import { MeteoraTradeRail } from "@/features/liquidity/components/MeteoraTradeRail";
import { RaydiumTradeRail } from "@/features/liquidity/components/RaydiumTradeRail";
import { PoolDetailChartPanel } from "@/components/liquidity-detail/PoolDetailChartPanel";

export default function LiquidityPoolPage({ id }: { id: string }) {
  const pool = useLiquidityPool(id);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <BackButton />
      <main className="flex min-h-0 flex-1">
        <ScrollArea>
          <QueryState query={pool}>
            {(query) => <PoolDetailSidebar pool={query.data} />}
          </QueryState>
          <ScrollBar showScrollBar />
        </ScrollArea>

        <ScrollArea className={"grow"}>
          <PoolDetailChartPanel />
          <ScrollBar showScrollBar />
        </ScrollArea>

        <ScrollArea className={"w-full max-w-92.5 border-l px-2 pr-4"}>
          <QueryState query={pool}>
            {(_query) => (
              <>
                {pool.data?.dex === "meteora-dlmm" && <MeteoraTradeRail />}
                {pool.data?.dex === "orca" && <OrcaTradeRail />}
                {pool.data?.dex === "raydium-clmm" && <RaydiumTradeRail />}
              </>
            )}
          </QueryState>

          <ScrollBar showScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
}
