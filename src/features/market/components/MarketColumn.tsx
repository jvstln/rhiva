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
    <section className="flex min-w-0 flex-1 flex-col border-border/70 border-r last:border-r-0">
      <div className="flex items-center justify-between gap-3 border-border/70 border-b px-4 py-3">
        <h2 className="shrink-0 font-bold text-b-1 text-white">{title}</h2>
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
