import { AssistantBubble } from "./assistant-bubble";
import { Navbar } from "./navbar";
import { PoolsHeader } from "./pools-header";
import { PoolsTable } from "./pools-table";
import { PoolsToolbar } from "./pools-toolbar";

export function LiquidityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar active="Liquidity" walletConnected walletAddress="1Ffm...bpaZ" />
      <PoolsHeader />
      <PoolsToolbar />
      <PoolsTable />
      <AssistantBubble />
    </div>
  );
}
