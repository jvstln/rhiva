"use client";

import { ChevronDown, Filter, Rocket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POOL_TABS } from "@/data/liquidity-data";
import { cn } from "@/lib/utils";

const POOL_TYPE_DOTS = [
  "bg-gradient-to-br from-orange-400 to-rose-500",
  "bg-gradient-to-br from-amber-300 to-yellow-500",
  "bg-gradient-to-br from-indigo-400 to-blue-600",
];

export function PoolsToolbar() {
  const [tab, setTab] = useState<(typeof POOL_TABS)[number]>("Trending");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 pb-4">
      <div className="flex items-center gap-6">
        {POOL_TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-b-2 font-medium transition-colors",
              tab === t ? "text-primary" : "text-grey hover:text-white/80",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-md border border-border/70 px-2 py-1.5">
          <span className="mr-1 text-b-4 font-medium text-white">
            All pools
          </span>
          {POOL_TYPE_DOTS.map((c, i) => (
            <span key={i} className={cn("size-4 rounded-full", c)} />
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-md border border-primary/50 px-2 py-1.5">
          <Rocket className="size-4 text-primary" />
          <span className="text-b-4 font-medium text-white">Ape In</span>
          <Input
            defaultValue="0.1"
            className="h-6 w-14 border-none bg-transparent p-0 text-center text-b-4"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-border/70 px-3 py-2 text-b-3 font-medium text-white"
        >
          24h <ChevronDown className="size-3.5" />
        </button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/70"
        >
          <Filter className="size-3.5" />
          Filter
        </Button>
      </div>
    </div>
  );
}
