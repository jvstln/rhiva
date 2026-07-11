import { ScrollArea } from "@/components/ui/scroll-area";

import { PoolFeeDetails } from "./PoolFeeDetails";
import { PoolIdentityCard } from "./PoolIdentityCard";
import { PoolVolumeAndTvl } from "./PoolVolumeAndTvl";

export function PoolDetailSidebar() {
  return (
    <aside className="w-[380px] shrink-0 border-border/70 border-r">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <PoolIdentityCard />
        <PoolFeeDetails />
        <PoolVolumeAndTvl />
      </ScrollArea>
    </aside>
  );
}
