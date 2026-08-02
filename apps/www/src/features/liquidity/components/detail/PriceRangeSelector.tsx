"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LiquidityPool } from "../../liquidity.type";
import { formatPrice, getPoolPriceInQuote } from "../../liquidity.util";

const SPREAD_PRESETS = ["±1%", "±5%", "±10%"] as const;
type Spread = (typeof SPREAD_PRESETS)[number];

const spreadOf = (preset: Spread) =>
  Number(preset.replace(/[^0-9]/g, "")) / 100;

export function PriceRangeSelector({ pool }: { pool: LiquidityPool }) {
  const price = getPoolPriceInQuote(pool) ?? 0;
  const binStepRatio = 1 + (pool.bin_step ?? 0) / 10_000;
  const available = price > 0;

  const [spread, setSpread] = useState<Spread>("±1%");
  const [minPrice, setMinPrice] = useState(price * (1 - spreadOf("±1%")));
  const [maxPrice, setMaxPrice] = useState(price * (1 + spreadOf("±1%")));

  const binsInRange = useMemo(() => {
    if (minPrice <= 0 || maxPrice <= minPrice) return 0;
    const distribution = pool.liquidity_distribution;
    if (distribution?.length) {
      return distribution.filter(
        (bin) => bin.price >= minPrice && bin.price <= maxPrice,
      ).length;
    }
    // TODO: Fall back to a bin_step estimate when the liquidity
    // distribution isn't available for this pool.
    return Math.max(
      1,
      Math.round(Math.log(maxPrice / minPrice) / Math.log(binStepRatio)),
    );
  }, [pool, minPrice, maxPrice, binStepRatio]);

  const applyPreset = (preset: Spread) => {
    setSpread(preset);
    const spread = spreadOf(preset);
    setMinPrice(price * (1 - spread));
    setMaxPrice(price * (1 + spread));
  };

  const stepMin = (direction: "up" | "down") => {
    if (!available) return;
    const next =
      direction === "up" ? minPrice * binStepRatio : minPrice / binStepRatio;
    setMinPrice(Math.min(Math.max(next, 0), maxPrice));
  };

  const stepMax = (direction: "up" | "down") => {
    if (!available) return;
    const next =
      direction === "up" ? maxPrice * binStepRatio : maxPrice / binStepRatio;
    setMaxPrice(Math.max(next, minPrice));
  };

  return (
    <div className="space-y-4 border-border/70 border-t p-4">
      <div className="flex items-center gap-2">
        {SPREAD_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset}
            onClick={() => applyPreset(preset)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-medium text-b-4 transition-colors",
              spread === preset
                ? "border-primary/60 bg-primary/10 text-white"
                : "border-border/70 text-gray hover:text-white/80",
            )}
          >
            {preset}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
          <span className="text-b-4 text-gray">Bins</span>
          <span className="font-semibold text-b-4 text-white">
            {binsInRange}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceStepper
          label="Min Price"
          value={available ? formatPrice(minPrice, 4) : "—"}
          onStep={stepMin}
        />
        <PriceStepper
          label="Max Price"
          value={available ? formatPrice(maxPrice, 4) : "—"}
          onStep={stepMax}
        />
      </div>

      <div className="sticky bottom-4 bg-background py-2">
        <Button className="w-full">Open Position</Button>
      </div>
    </div>
  );
}

function PriceStepper({
  label,
  value,
  onStep,
}: {
  label: string;
  value: string;
  onStep: (direction: "up" | "down") => void;
}) {
  return (
    <div>
      <p className="mb-1 text-b-4 text-gray">{label}</p>
      <div className="flex items-center justify-between rounded-md border border-border/70 px-2 py-2">
        <button
          type="button"
          onClick={() => onStep("up")}
          className="flex size-6 items-center justify-center rounded text-gray hover:text-white"
        >
          <Plus className="size-3.5" />
        </button>
        <span className="font-medium text-b-3 text-white">{value}</span>
        <button
          type="button"
          onClick={() => onStep("down")}
          className="flex size-6 items-center justify-center rounded text-gray hover:text-white"
        >
          <Minus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
