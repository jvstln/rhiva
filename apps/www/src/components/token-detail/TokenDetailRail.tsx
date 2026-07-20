import { ScrollArea } from "@/components/ui/scroll-area";
import type { Token } from "@/features/market/market.token.type";
import {
  BasicDataCard,
  DevInfoCard,
  DynamicPoolInfoCard,
} from "./PoolAndDevInfo";
import { SecurityStatsGrid } from "./SecurityStatsGrid";
import { TimeframeStats } from "./TimeframeStats";
import { AvatarReusedCard, TokenAuditCard } from "./TokenAuditAndAvatars";
import { TradePanel } from "./TradePanel";

type TokenDetailRailProps = { token: Token };

export function TokenDetailRail({ token }: TokenDetailRailProps) {
  const avatarItems = token.name
    ? [
        {
          name: token.symbol ?? token.name,
          wallet: `${token.mint.slice(0, 6)}...${token.mint.slice(-4)}`,
          mc:
            token.live?.dexscreener_market_cap_usd !== undefined
              ? `$${token.live.dexscreener_market_cap_usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : "N/A",
          age: token.recent_listing_time
            ? `${Math.max(1, Math.round(token.recent_listing_time / 86400))}d`
            : "Live",
        },
      ]
    : [];

  return (
    <aside className="w-95 shrink-0 border-border/70 border-l">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <TimeframeStats token={token} />
        <TradePanel />
        <SecurityStatsGrid token={token} />
        <DynamicPoolInfoCard token={token} />
        <DevInfoCard token={token} />
        <BasicDataCard token={token} />
        <TokenAuditCard token={token} />
        <AvatarReusedCard items={avatarItems} />
      </ScrollArea>
    </aside>
  );
}
