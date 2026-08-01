import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMarketStore } from "../market.store";
import type { RadarColumns } from "../market.schema";
import { RadarFilterDialog } from "./RadarFilterDialog";
import { SearchInput } from "@/components/ui/search-input";
import { BondingCurveToggle, QuickBuyInput } from "./ToolbarItems";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
          className="max-w-28"
        />
        <QuickBuyInput
          variant="minimal"
          value={quickBuy ?? ""}
          onValueChange={(value) =>
            setFilters({ [column]: { quickBuy: value } })
          }
          className="max-w-20"
        />
        <BondingCurveToggle />
        <RadarFilterDialog defaultTab={column}>
          <Button
            size="icon-sm"
            variant={"ghost"}
          >
            <Filter />
          </Button>
        </RadarFilterDialog>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
