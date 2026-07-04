import { AssistantBubble } from "./assistant-bubble";
import { Navbar } from "./navbar";
import { PortfolioHero } from "./portfolio-hero";
import { PositionStatsBar } from "./position-stats-bar";
import { PositionsTable } from "./positions-table";

export function PortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar active="Portfolio" walletConnected walletAddress="1Ffm...bpaZ" />

      <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-6 py-6">
        <PortfolioHero />
        <PositionStatsBar />
        <PositionsTable />
      </main>

      <AssistantBubble />
    </div>
  );
}
