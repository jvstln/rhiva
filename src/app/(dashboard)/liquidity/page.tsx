import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { PoolsHeader } from "@/components/liquidity/PoolsHeader";
import { PoolsTable } from "@/components/liquidity/PoolsTable";
import { PoolsToolbar } from "@/components/liquidity/PoolsToolbar";

export default function LiquidityPage() {
  return (
    <>
      <PoolsHeader />
      <PoolsToolbar />
      <PoolsTable />
      <AssistantBubble />
    </>
  );
}
