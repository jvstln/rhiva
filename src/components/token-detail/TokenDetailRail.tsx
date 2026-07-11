import { ScrollArea } from "@/components/ui/scroll-area";
import { AVATAR_REUSED } from "@/data/token-detail-data";
import {
  BasicDataCard,
  DevInfoCard,
  DynamicPoolInfoCard,
} from "./PoolAndDevInfo";
import { SecurityStatsGrid } from "./SecurityStatsGrid";
import { TimeframeStats } from "./TimeframeStats";
import { AvatarReusedCard, TokenAuditCard } from "./TokenAuditAndAvatars";
import { TradePanel } from "./TradePanel";

export function TokenDetailRail() {
  return (
    <aside className="w-[380px] shrink-0 border-border/70 border-l">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <TimeframeStats />
        <TradePanel />
        <SecurityStatsGrid />
        <DynamicPoolInfoCard />
        <DevInfoCard />
        <BasicDataCard />
        <TokenAuditCard />
        <AvatarReusedCard items={AVATAR_REUSED} />
      </ScrollArea>
    </aside>
  );
}
