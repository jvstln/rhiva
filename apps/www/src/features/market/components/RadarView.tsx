"use client";

import { capitalize } from "@/lib/utils";
import { useRadarTokens } from "../market.hook";
import { RadarColumns } from "../market.schema";
import { useMarketStore } from "../market.store";
import { RadarTokenCard } from "./RadarTokenCard";
import { RadarColumnToolbar } from "./RadarColumnToolbar";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const RadarView = () => {
  const radarFilters = useMarketStore((state) => state.radarFilters);

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
    <div className="flex h-full min-h-0 flex-1 rounded-xl border">
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
            className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-border/70 border-r last:border-r-0"
          >
            <div className="flex items-center justify-between gap-4 border-border/70 border-b px-4 py-3">
              <h2 className="shrink-0 font-bold text-b-1 text-white">
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
  );
};
