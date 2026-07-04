import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { Navbar } from "@/components/layout/Navbar";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PositionStatsBar } from "@/components/portfolio/PositionStatsBar";
import { PositionsTable } from "@/components/portfolio/PositionsTable";

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar walletConnected walletAddress="1Ffm...bpaZ" />

      <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-6 py-6">
        <PortfolioHero />
        <PositionStatsBar />
        <PositionsTable />
      </main>

      <AssistantBubble />
    </div>
  );
}
