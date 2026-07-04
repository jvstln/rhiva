import { ScrollArea } from "@/components/ui/scroll-area";

import { PoolFeeDetails } from "./pool-fee-details";
import { PoolIdentityCard } from "./pool-identity-card";
import { PoolVolumeAndTvl } from "./pool-volume-and-tvl";

export function PoolDetailSidebar() {
  return (
    <aside className="w-[380px] shrink-0 border-r border-border/70">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <PoolIdentityCard />
        <PoolFeeDetails />
        <PoolVolumeAndTvl />
      </ScrollArea>
    </aside>
  );
}
