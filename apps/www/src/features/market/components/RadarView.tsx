"use client";

import { useState } from "react";
import { capitalize, cn } from "@/lib/utils";
import { useRadarTokens } from "../market.hook";
import { RadarColumns } from "../market.schema";
import { useMarketStore } from "../market.store";
import { RadarTokenCard } from "./RadarTokenCard";
import { RadarColumnToolbar } from "./RadarColumnToolbar";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const COLUMN_LABELS: Record<RadarColumns, string> = {
  fresh: "Fresh",
  heatingUp: "Heating Up",
  graduated: "Graduated",
};

export const RadarView = () => {
  const radarFilters = useMarketStore((state) => state.radarFilters);
  const [activeColumn, setActiveColumn] = useState<RadarColumns>("fresh");

  const freshQuery = useRadarTokens({
    ...radarFilters.fresh,
    type: "fresh",
  });
  const heatingQuery = useRadarTokens({
    ...radarFilters.heatingUp,
    type: "heatingUp",
  });
  const graduatedQuery = useRadarTokens({
    ...radarFilters.graduated,
    type: "graduated",
  });

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-xl border">
      {/* Mobile-only column switcher */}
      <div className="flex justify-center border-border/70 border-b px-4 py-2 lg:hidden">
        <ToggleGroup
          aria-label="Radar columns"
          className="w-full"
          value={[activeColumn]}
          onValueChange={(value) => {
            const next = value[0] as RadarColumns | undefined;
            if (next) setActiveColumn(next);
          }}
        >
          {RadarColumns.options.map((column) => (
            <ToggleGroupItem
              key={column}
              value={column}
              aria-pressed={activeColumn === column}
              className="flex-1"
            >
              {COLUMN_LABELS[column]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex min-h-0 flex-1">
        {RadarColumns.options.map((column) => {
          const query =
            column === "fresh"
              ? freshQuery
              : column === "heatingUp"
                ? heatingQuery
                : graduatedQuery;

          return (
            <section
              key={column}
              data-mobile-active={activeColumn === column || undefined}
              className={cn(
                "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-border/70 border-r last:border-r-0",
                // Only the active column is shown on smaller screens
                activeColumn !== column && "max-lg:hidden",
              )}
            >
              <div className="flex items-center justify-between gap-4 border-border/70 border-b px-4 py-3">
                <h2 className="truncate font-bold text-b-1 text-white">
                  {capitalize(column)}
                </h2>
                <RadarColumnToolbar column={column} />
              </div>

              <ScrollArea className="h-full min-h-0 flex-1">
                <QueryState
                  query={query}
                  getIsLoading={(q) => q.isPending}
                >
                  {query.data?.map((token) => (
                    <RadarTokenCard
                      key={token.mint}
                      token={token}
                      column={column}
                    />
                  ))}
                </QueryState>
                <ScrollBar
                  showScrollBar
                  showIndicator
                />
              </ScrollArea>
            </section>
          );
        })}
      </div>
    </div>
  );
};
