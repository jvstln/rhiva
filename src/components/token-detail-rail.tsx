import { ScrollArea } from "@/components/ui/scroll-area";
import { AVATAR_REUSED } from "@/lib/mock/token-detail-data";
import {
  BasicDataCard,
  DevInfoCard,
  DynamicPoolInfoCard,
} from "./pool-and-dev-info";
import { SecurityStatsGrid } from "./security-stats-grid";
import { TimeframeStats } from "./timeframe-stats";
import { AvatarReusedCard, TokenAuditCard } from "./token-audits-and-avatars";
import { TradePanel } from "./trade-panel";

export function TokenDetailRail() {
  return (
    <aside className="w-[380px] shrink-0 border-l border-border/70">
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
