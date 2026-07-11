import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SearchInput } from "@/components/ui/search-input";
import type { RadarColumns } from "../market.schema";
import { useMarketStore } from "../market.store";
import { BondingCurveToggle, QuickBuyInput } from "./ToolbarItems";

interface ColumnToolbarProps {
  column: RadarColumns;
}

export function RadarColumnToolbar({ column }: ColumnToolbarProps) {
  const quickBuy = useMarketStore(
    (state) => state.radarFilters[column].quickBuy,
  );
  const setFilters = useMarketStore((state) => state.setRadarFilters);

  return (
    <ScrollArea className="min-w-0">
      <div className="flex w-full items-center gap-1.5">
        <SearchInput
          data-size="sm"
          placeholder="Keyword1,..."
          className="rounded-md"
        />
        <QuickBuyInput
          variant="minimal"
          value={quickBuy ?? ""}
          onValueChange={(value) => setFilters({ [column]: value })}
          className="rounded-md"
        />
        <BondingCurveToggle />
        <Button size="icon-sm" variant={"ghost"}>
          <Filter />
        </Button>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
