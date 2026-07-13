import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PoolDetailChartPanel } from "@/components/liquidity-detail/PoolDetailChartPanel";
import { PoolDetailSidebar } from "@/components/liquidity-detail/PoolDetailSidebar";
import { PoolDetailTradeRail } from "@/components/liquidity-detail/PoolDetailTradeRail";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OrcaTradeRail } from "@/features/liquidity/components/OrcaTradeRail";
import { RaydiumTradeRail } from "@/features/liquidity/components/RaydiumTradeRail";
import type { Pool } from "@/features/liquidity/liquidity.schema";

export default function LiquidityPoolPage({ dex = "meteora" }: { dex?: Pool }) {
  return (
    <div>
      <Link href="/liquidity" className={buttonVariants({ variant: "ghost" })}>
        <ChevronLeft />
        Back
      </Link>
      <main className="flex flex-1">
        <PoolDetailSidebar />
        <PoolDetailChartPanel />
        <aside className="w-[420px] shrink-0 border-border/70 border-l p-4">
          <ScrollArea>
            {dex === "meteora" && <PoolDetailTradeRail />}
            {dex === "orca" && <OrcaTradeRail />}
            {dex === "raydium" && <RaydiumTradeRail />}

            <ScrollBar />
          </ScrollArea>
        </aside>
      </main>
    </div>
  );
}
