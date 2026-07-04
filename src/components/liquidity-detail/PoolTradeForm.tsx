"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MODES = ["Spot", "Curve", "Bid-Ask"] as const;
const RATIO_PRESETS = ["50:50", "75:25", "40:60"] as const;

export function PoolTradeForm() {
  const [mode, setMode] = useState<(typeof MODES)[number]>("Spot");
  const [token, setToken] = useState<"SOL" | "USDC">("SOL");
  const [ratio, setRatio] = useState(50);

  return (
    <div className="space-y-5 p-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="w-full">
          {MODES.map((m) => (
            <TabsTrigger key={m} value={m} className="text-b-2">
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-b-3 font-medium text-gray">
            SOL
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-b-4">
          <span className="text-gray">Balance: 0 SOL</span>
          <span className="flex gap-3 text-gray">
            <button type="button" className="hover:text-white">
              25%
            </button>
            <button type="button" className="hover:text-white">
              50%
            </button>
            <button type="button" className="font-medium text-primary">
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
              className="rounded-md border border-border/70 py-1.5 text-b-4 font-medium text-gray hover:border-primary/50 hover:text-white"
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="rounded-md border border-border/70 py-1.5 text-b-4 font-medium text-gray"
          >
            Custom ration
          </button>
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
        "rounded-md py-2 text-b-3 font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-gray",
      )}
    >
      {label}
    </button>
  );
}
