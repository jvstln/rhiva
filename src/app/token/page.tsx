import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { Navbar } from "@/components/layout/Navbar";
import { TokenDetailHeader } from "@/components/token-detail/TokenDetailHeader";
import { TokenDetailRail } from "@/components/token-detail/TokenDetailRail";
import { TradesTable } from "@/components/token-detail/TradesTable";
import { TradingChartPanel } from "@/components/token-detail/TradingChartPanel";

export default function TokenDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar walletConnected walletAddress="1Ffm...bpaZ" />
      <TokenDetailHeader />

      <main className="flex flex-1">
        <TradingChartPanel />
        <TokenDetailRail />
      </main>

      <TradesTable />
      <AssistantBubble />
    </div>
  );
}
