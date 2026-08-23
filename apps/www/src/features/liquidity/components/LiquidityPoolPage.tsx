"use client";

import { BackButton } from "@/components/layout/BackButton";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OrcaTradeRail } from "@/features/liquidity/components/OrcaTradeRail";
import { PositionsPanel } from "@/features/liquidity/components/detail/PositionsPanel";
import { PoolDetailSidebar } from "@/features/liquidity/components/detail/PoolDetailSidebar";
import { MeteoraTradeRail } from "@/features/liquidity/components/MeteoraTradeRail";
import { RaydiumTradeRail } from "@/features/liquidity/components/RaydiumTradeRail";
import { PoolChart } from "@/features/tradeview/components/PoolChart";
import { useLiquidityPool } from "../liquidity.hook";
import {
  useLiquidityDetailsWebsocket,
  useLiquidityPoolWebsocket,
} from "../liquidity.ws";

export default function LiquidityPoolPage({ id }: { id: string }) {
  useLiquidityPoolWebsocket(id);
  useLiquidityDetailsWebsocket(id);
  const poolQuery = useLiquidityPool(id);

  return (
    <QueryState query={poolQuery}>
      {({ data: pool }) => (
        <div className="flex h-full min-h-0 flex-col">
          <BackButton />
          <main className="flex min-h-0 flex-1 flex-col xl:flex-row">
            <ScrollArea className="shrink-0 border-border/70 max-xl:border-b xl:h-full xl:w-1/4 xl:min-w-72">
              <PoolDetailSidebar pool={pool} />
              <ScrollBar showScrollBar />
            </ScrollArea>

            <ScrollArea className="grow xl:h-full">
              <div className="h-[60vh]">
                <PoolChart pool={pool} />
              </div>
              <PositionsPanel pool={pool} />
              <ScrollBar showScrollBar />
            </ScrollArea>

            <ScrollArea className="w-full border-border/70 px-2 pr-4 xl:h-full xl:max-w-92.5 xl:border-l">
              {pool.dex === "meteora-dlmm" && <MeteoraTradeRail pool={pool} />}
              {pool.dex === "orca-whirlpool" && <OrcaTradeRail pool={pool} />}
              {pool.dex === "raydium-clmm" && <RaydiumTradeRail pool={pool} />}
              <ScrollBar showScrollBar />
            </ScrollArea>
          </main>
        </div>
      )}
    </QueryState>
  );
}
