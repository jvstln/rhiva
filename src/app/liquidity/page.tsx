import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { Navbar } from "@/components/layout/Navbar";
import { PoolsHeader } from "@/components/liquidity/PoolsHeader";
import { PoolsTable } from "@/components/liquidity/PoolsTable";
import { PoolsToolbar } from "@/components/liquidity/PoolsToolbar";

export default function LiquidityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar walletConnected walletAddress="1Ffm...bpaZ" />
      <PoolsHeader />
      <PoolsToolbar />
      <PoolsTable />
      <AssistantBubble />
    </div>
  );
}
