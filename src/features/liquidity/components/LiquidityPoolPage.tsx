import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { PoolDetailChartPanel } from "@/components/liquidity-detail/PoolDetailChartPanel";
import { PoolDetailSidebar } from "@/components/liquidity-detail/PoolDetailSidebar";
import { PoolDetailTradeRail } from "@/components/liquidity-detail/PoolDetailTradeRail";
import { buttonVariants } from "@/components/ui/button";

export default function LiquidityPoolPage() {
  return (
    <div>
      <Link href="/liquidity" className={buttonVariants({ variant: "ghost" })}>
        <ChevronLeft />
        Back
      </Link>
      <main className="flex flex-1">
        <PoolDetailSidebar />
        <PoolDetailChartPanel />
        <PoolDetailTradeRail />
      </main>

      <AssistantBubble />
    </div>
  );
}
