"use client";
import { ArrowUpDown, EyeOff, Filter, Layers, Settings2 } from "lucide-react";

import * as React from "react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const NAV_TABS = [
  "Watchlist",
  "Trending",
  "Radar",
  "Surge",
  "Pump Live",
] as const;
const TIMEFRAMES = ["1m", "5m", "1h", "6h", "24h"] as const;
const PRIORITY_TABS = ["P1", "P2", "P3"] as const;

export type NavTab = (typeof NAV_TABS)[number];
export type Timeframe = (typeof TIMEFRAMES)[number];
export type PriorityTab = (typeof PRIORITY_TABS)[number];

export type MarketToolbarFilter = {
  view: NavTab;
  timeframe: Timeframe;
  priority: PriorityTab;
  hideSmall: boolean;
};

export interface MarketToolbarProps {
  filters: MarketToolbarFilter;
  setFilters: React.Dispatch<React.SetStateAction<MarketToolbarFilter>>;
  onToggleHideSmall?: (hidden: boolean) => void;
  onFilterClick?: () => void;
  onSettingsClick?: () => void;
  onSortClick?: () => void;
  onLayersClick?: () => void;
  className?: string;
}

export function MarketToolbar({
  filters,
  setFilters,
  onToggleHideSmall,
  onFilterClick,
  onSettingsClick,
  onSortClick,
  onLayersClick,
  className,
}: MarketToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-[52px] w-full items-center justify-between gap-8 px-4",
        className,
      )}
    >
      {/* ---------------------------------------------------------- */}
      {/* Part 1a — section nav tabs                                  */}
      {/* ---------------------------------------------------------- */}
      <nav className="flex items-center gap-0.5" aria-label="Market sections">
        {NAV_TABS.map((tab, i) => (
          <React.Fragment key={tab}>
            <Button
              variant="ghost"
              type="button"
              size="sm"
              onClick={() => {
                setFilters((prev) => ({ ...prev, view: tab }));
              }}
              aria-current={filters.view === tab ? "page" : undefined}
              data-active={filters.view === tab ? true : undefined}
            >
              {tab}
            </Button>
            {i === 0 && (
              <span className="h-4 w-px bg-white/30" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-8">
        {/* -------------------------------------------------------- */}
        {/* Part 1b — timeframe tabs                                  */}
        {/* -------------------------------------------------------- */}
        <div
          className="flex items-center gap-0.5 rounded-[7px] bg-primary/3 p-0.5"
          role="tablist"
          aria-label="Timeframe"
        >
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              type="button"
              role="tab"
              aria-selected={filters.timeframe === tf}
              onClick={() => {
                setFilters((prev) => ({ ...prev, timeframe: tf }));
              }}
              className={cn(
                "flex h-7 min-w-12 items-center justify-center rounded-md px-3 text-sm tracking-[-0.2px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                filters.timeframe === tf
                  ? "bg-primary/5 text-white"
                  : "text-gray hover:text-white/70",
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* -------------------------------------------------------- */}
        {/* Part 2 — quick filters                                    */}
        {/* -------------------------------------------------------- */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Hide small balances"
            aria-pressed={filters.hideSmall}
            className={cn(
              filters.hideSmall ? "text-sell" : "text-sell/70 hover:text-sell",
            )}
            onClick={() => {
              const next = !filters.hideSmall;
              setFilters((prev) => ({ ...prev, hideSmall: next }));
              onToggleHideSmall?.(next);
            }}
          >
            <EyeOff className="size-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-white hover:text-white"
            onClick={onFilterClick}
          >
            <Filter className="size-3.5 text-gray" />
            Filter
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Settings"
            className="text-gray hover:text-white"
            onClick={onSettingsClick}
          >
            <Settings2 className="size-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Sort"
            className="text-dodger-blue hover:text-dodger-blue/80"
            onClick={onSortClick}
          >
            <ArrowUpDown className="size-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle layers"
            className="text-primary hover:text-primary/80"
            onClick={onLayersClick}
          >
            <Layers className="size-[18px]" />
          </Button>
        </div>

        {/* -------------------------------------------------------- */}
        {/* Part 2b — priority segmented control                      */}
        {/* -------------------------------------------------------- */}
        <div
          className="flex items-center gap-1 rounded-md bg-white/5 p-0.5"
          role="tablist"
          aria-label="Priority tier"
        >
          {PRIORITY_TABS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={filters.priority === p}
              onClick={() => {
                setFilters((prev) => ({ ...prev, priority: p }));
              }}
              className={cn(
                "flex h-7 items-center justify-center rounded-sm px-2.5 text-xs font-medium tracking-[-0.2px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                filters.priority === p
                  ? "bg-primary/5 text-[#69CF8D]"
                  : "text-gray hover:text-white/70",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
