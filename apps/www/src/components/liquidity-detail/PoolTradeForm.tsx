"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MODES = ["Spot", "Curve", "Bid-Ask"] as const;
const RATIO_PRESETS = ["50:50", "75:25", "40:60"] as const;
const BINS = Array.from({ length: 42 }, (_, i) => i);

const getBinHeight = (bin: number, mode: string) => {
  const mid = 20.5;
  if (mode === "Spot") return 100;
  if (mode === "Curve") {
    return Math.max(5, 100 * Math.exp(-((bin - mid) ** 2) / 80));
  }
  if (mode === "Bid-Ask") {
    return Math.min(100, 30 + Math.abs(bin - mid) * 3.5);
  }
  return 50;
};

export function PoolTradeForm() {
  const [mode, setMode] = useState<(typeof MODES)[number]>("Spot");
  const [token, setToken] = useState<"SOL" | "USDC">("SOL");
  const [ratio, setRatio] = useState(50);

  return (
    <div className="space-y-5 p-4">
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as typeof mode)}
      >
        <TabsList
          className="w-full"
          variant={"line"}
        >
          {MODES.map((m) => (
            <TabsTrigger
              key={m}
              value={m}
            >
              {m}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div>
        <p className="mb-2 text-b-3 text-gray">Trade amount</p>
        <div className="relative">
          <Input
            defaultValue="0.0"
            className="h-12 border-border/70 pr-16 text-b-1"
          />
          <span className="-translate-y-1/2 absolute top-1/2 right-3 font-medium text-b-3 text-gray">
            SOL
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-b-4">
          <span className="text-gray">Balance: 0 SOL</span>
          <span className="flex gap-3 text-gray">
            <button
              type="button"
              className="hover:text-white"
            >
              25%
            </button>
            <button
              type="button"
              className="hover:text-white"
            >
              50%
            </button>
            <button
              type="button"
              className="font-medium text-primary"
            >
              Max
            </button>
          </span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-b-3 text-gray">Liquidity Ratio %</p>
        <Slider
          value={[ratio]}
          onValueChange={(v) => setRatio(Array.isArray(v) ? v[0] : v)}
          max={100}
          step={1}
        />
        <div className="mt-1 flex justify-between text-b-4 text-gray">
          <span>{ratio}% SOL</span>
          <span>{100 - ratio}% USDC</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <TokenToggle
            label="SOL"
            active={token === "SOL"}
            onClick={() => setToken("SOL")}
          />
          <TokenToggle
            label="USDC"
            active={token === "USDC"}
            onClick={() => setToken("USDC")}
          />
        </div>

        <div className="mt-2 grid grid-cols-4 gap-2">
          {RATIO_PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              className="rounded-md border border-border/70 py-1.5 font-medium text-b-4 text-gray hover:border-primary/50 hover:text-white"
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="rounded-md border border-border/70 py-1.5 font-medium text-b-4 text-gray"
          >
            Custom ration
          </button>
        </div>
      </div>

      <div>
        <p className="text-center text-b-3 text-gray">
          Current Price:{" "}
          <span className="font-medium text-white">
            0.05329 {mode === "Spot" ? "SOL per USDC" : ""}
          </span>
        </p>

        <div className="relative mt-4">
          <div className="flex h-16 items-end gap-[1px]">
            {BINS.map((bin) => (
              <span
                key={bin}
                className={cn(
                  "flex-1",
                  bin <= 20 ? "bg-violet-600" : "bg-primary",
                )}
                style={{ height: `${getBinHeight(bin, mode)}%` }}
              />
            ))}
          </div>
          {/* Center line */}
          <div className="-translate-x-1/2 absolute top-[-10px] bottom-0 left-1/2 w-0.5 bg-white" />

          {/* Bottom solid bar */}
          <div className="h-1 w-full bg-primary" />

          {/* End markers */}
          <div className="absolute bottom-[-4px] left-0 h-3 w-0.5 bg-white" />
          <div className="absolute right-0 bottom-[-4px] h-3 w-0.5 bg-white" />
        </div>

        <div className="mt-1 flex justify-between text-b-6 text-gray">
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
          <span>0.05216</span>
        </div>
      </div>
    </div>
  );
}

function TokenToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md py-2 font-semibold text-b-3 transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-gray",
      )}
    >
      {label}
    </button>
  );
}
