import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { Navbar } from "@/components/layout/Navbar";
import { PoolDetailChartPanel } from "@/components/liquidity-detail/PoolDetailChartPanel";
import { PoolDetailSidebar } from "@/components/liquidity-detail/PoolDetailSidebar";
import { PoolDetailTradeRail } from "@/components/liquidity-detail/PoolDetailTradeRail";

export default function LiquidityDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar walletConnected walletAddress="1Ffm...bpaZ" />

      <main className="flex flex-1">
        <PoolDetailSidebar />
        <PoolDetailChartPanel />
        <PoolDetailTradeRail />
      </main>

      <AssistantBubble />
    </div>
  );
}
