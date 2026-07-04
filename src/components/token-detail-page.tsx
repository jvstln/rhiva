import { AssistantBubble } from "./assistant-bubble";
import { Navbar } from "./navbar";
import { TokenDetailHeader } from "./token-detail-header";
import { TokenDetailRail } from "./token-detail-rail";
import { TradesTable } from "./trade-table";
import { TradingChartPanel } from "./trading-chart-panel";

export function TokenDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar active="Market" walletConnected walletAddress="1Ffm...bpaZ" />
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
