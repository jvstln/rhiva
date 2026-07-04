import { ScrollArea } from "@/components/ui/scroll-area";

import { PoolTradeForm } from "./PoolTradeForm";
import { PriceRangeSelector } from "./PriceRangeSelector";

export function PoolDetailTradeRail() {
  return (
    <aside className="w-[420px] shrink-0 border-l border-border/70">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <PoolTradeForm />
        <PriceRangeSelector />
      </ScrollArea>
    </aside>
  );
}
