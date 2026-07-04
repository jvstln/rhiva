"use client";

import { Funnel, Rocket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { POOL_TABS } from "@/data/liquidity-data";
import { SettingsDialog } from "../layout/SettingsDialog";

const _POOL_TYPE_DOTS = [
  "bg-gradient-to-br from-orange-400 to-rose-500",
  "bg-gradient-to-br from-amber-300 to-yellow-500",
  "bg-gradient-to-br from-indigo-400 to-blue-600",
];

export function PoolsToolbar() {
  const [tab, setTab] = useState<(typeof POOL_TABS)[number]>("Trending");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 pb-4">
      <div className="flex items-center gap-1">
        {POOL_TABS.map((t) => (
          <Button
            key={t}
            onClick={() => setTab(t)}
            variant={"ghost"}
            size={"sm"}
            data-active={tab === t ? true : undefined}
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="inline-flex items-center gap-2">
        <SettingsDialog defaultTab="zap-in">
          <Button
            variant="ghost"
            className="rounded-md border border-emerald-500/20 bg-[#11181C] px-4 text-gray-300 hover:bg-[#182227]"
          >
            <Rocket className="mr-2 h-4 w-4 text-emerald-400" />
            <span className="font-medium">Zap In</span>
            <span className="ml-3 text-sm text-gray-400">0.1</span>
            <span className="ml-2 text-base">🇺🇸</span>
          </Button>
        </SettingsDialog>

        {/* Time */}
        <Button
          variant="ghost"
          className="h-10 rounded-md bg-[#11181C] px-4 text-gray-300 hover:bg-[#182227]"
        >
          24h
        </Button>

        {/* Filter */}
        <Button
          variant="ghost"
          className="h-10 rounded-md bg-[#11181C] px-4 text-gray-400 hover:bg-[#182227]"
        >
          <Funnel className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
}
