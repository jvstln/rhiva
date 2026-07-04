import { ScrollArea } from "@/components/ui/scroll-area";
import type { MarketToken } from "@/data/market-data";

import { ColumnToolbar } from "./ColumnToolbar";
import { TokenCard } from "./TokenCard";

interface MarketColumnProps {
  title: string;
  tokens: MarketToken[];
  showMcToggle?: boolean;
}

export function MarketColumn({
  title,
  tokens,
  showMcToggle,
}: MarketColumnProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-border/70 last:border-r-0">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <h2 className="shrink-0 text-b-1 font-bold text-white">{title}</h2>
        <ColumnToolbar showMcToggle={showMcToggle} />
      </div>

      <ScrollArea className="h-[calc(100vh-15.5rem)]">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </ScrollArea>
    </section>
  );
}
