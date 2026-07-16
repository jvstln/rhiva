"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PoolDetailChartPanel } from "@/components/liquidity-detail/PoolDetailChartPanel";
import { PoolDetailSidebar } from "@/components/liquidity-detail/PoolDetailSidebar";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MeteoraTradeRail } from "@/features/liquidity/components/MeteoraTradeRail";
import { OrcaTradeRail } from "@/features/liquidity/components/OrcaTradeRail";
import { RaydiumTradeRail } from "@/features/liquidity/components/RaydiumTradeRail";
import type { Pool } from "@/features/liquidity/liquidity.schema";
import { cn } from "@/lib/utils";

export default function LiquidityPoolPage({ dex = "meteora" }: { dex?: Pool }) {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Button
        onClick={() => router.back()}
        className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
      >
        <ChevronLeft />
        Back
      </Button>
      <main className="flex min-h-0 flex-1">
        <ScrollArea>
          <PoolDetailSidebar />
          <ScrollBar showScrollBar />
        </ScrollArea>

        <ScrollArea className={"grow"}>
          <PoolDetailChartPanel />
          <ScrollBar showScrollBar />
        </ScrollArea>

        <ScrollArea className={"w-full max-w-[370px] border-l px-2 pr-4"}>
          {dex === "meteora" && <MeteoraTradeRail />}
          {dex === "orca" && <OrcaTradeRail />}
          {dex === "raydium" && <RaydiumTradeRail />}

          <ScrollBar showScrollBar />
        </ScrollArea>
      </main>
    </div>
  );
}
