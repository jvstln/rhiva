"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPREAD_PRESETS = ["±1%", "±5%", "±10%"] as const;

export function PriceRangeSelector() {
  const [spread, setSpread] = useState<(typeof SPREAD_PRESETS)[number]>("±1%");

  return (
    <div className="space-y-4 border-border/70 border-t p-4">
      <div className="flex items-center gap-2">
        {SPREAD_PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setSpread(p)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-medium text-b-4 transition-colors",
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
          <span className="font-semibold text-b-4 text-white">69</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceStepper
          label="Min Price"
          value="109.493575"
        />
        <PriceStepper
          label="Max Price"
          value="109.493575"
        />
      </div>

      <div className="sticky bottom-4 bg-background py-2">
        <Button className="w-full">Open Position</Button>
      </div>
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
        <span className="font-medium text-b-3 text-white">{value}</span>
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
