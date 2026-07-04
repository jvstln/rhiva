"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPREAD_PRESETS = ["±1%", "±5%", "±10%"] as const;
const BINS = Array.from({ length: 42 }, (_, i) => i);
const ACTIVE_BIN_INDEX = 27;

export function PriceRangeSelector() {
  const [spread, setSpread] = useState<(typeof SPREAD_PRESETS)[number]>("±1%");

  return (
    <div className="space-y-4 border-t border-border/70 p-4">
      <div>
        <p className="text-b-3 text-gray">
          Current Price:{" "}
          <span className="font-medium text-white">0.05329 SOL per USDC</span>
        </p>

        <div className="mt-3 flex h-16 items-end gap-[2px]">
          {BINS.map((bin) => (
            <span
              key={bin}
              className={cn(
                "flex-1 rounded-t-sm",
                bin === ACTIVE_BIN_INDEX ? "bg-primary" : "bg-secondary",
              )}
              style={{ height: `${20 + ((bin * 37) % 60)}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-b-6 text-gray">
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {SPREAD_PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setSpread(p)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-b-4 font-medium transition-colors",
              spread === p
                ? "border-primary/60 bg-primary/10 text-white"
                : "border-border/70 text-gray hover:text-white/80",
            )}
          >
            {p}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
          <span className="text-b-4 text-gray">Bins</span>
          <span className="text-b-4 font-semibold text-white">69</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceStepper label="Min Price" value="109.493575" />
        <PriceStepper label="Max Price" value="109.493575" />
      </div>

      <Button className="h-12 w-full text-b-1 font-semibold">
        Open Position
      </Button>
    </div>
  );
}

function PriceStepper({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-b-4 text-gray">{label}</p>
      <div className="flex items-center justify-between rounded-md border border-border/70 px-2 py-2">
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded text-gray hover:text-white"
        >
          <Plus className="size-3.5" />
        </button>
        <span className="text-b-3 font-medium text-white">{value}</span>
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded text-gray hover:text-white"
        >
          <Minus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
