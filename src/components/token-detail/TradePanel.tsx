"use client";

import { ChevronDown, Repeat, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TIERS = ["P1", "P2", "P3"] as const;
const QUICK_AMOUNTS = ["0.01", "0.1", "0.5", "1"] as const;

export function TradePanel() {
  const [side, setSide] = useState<"Buy" | "Sell" | "LP">("Buy");
  const [tier, setTier] = useState<(typeof TIERS)[number]>("P1");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-3 border-t border-border/70 p-4">
      <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
        <div className="flex items-center justify-between text-b-4">
          <span className="text-gray">Dev's Best Token</span>
          <span className="font-medium text-white">TikTok (ATH MC $231K)</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
        <span className="flex items-center gap-1.5 text-b-3 font-medium text-white">
          <span className="flex size-4 items-center justify-center rounded-full bg-white text-b-6 font-bold text-black">
            X
          </span>
          Connection
        </span>
        <span className="text-b-3 font-semibold text-white">99+</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {TIERS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTier(t)}
              className={cn(
                "rounded-md px-3 py-1 text-b-3 font-semibold transition-colors",
                tier === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-gray",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <button type="button" className="text-gray">
          <ChevronDown className="size-4" />
        </button>
      </div>

      <Tabs value={side} onValueChange={(v) => setSide(v as typeof side)}>
        <TabsList className="grid w-full grid-cols-3 rounded-md bg-secondary p-1">
          {(["Buy", "Sell", "LP"] as const).map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              className={cn(
                "rounded-md py-1.5 text-center data-[state=active]:bg-background",
                s === "Buy" && "data-[state=active]:text-up",
                s === "Sell" && "data-[state=active]:text-sell",
              )}
            >
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between text-b-4 text-gray">
        <span>Bal: 0 SOL</span>
      </div>

      <div className="relative">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="h-12 border-border/70 pr-16 text-b-1"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-b-3 font-medium text-gray">
          SOL
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amt) => (
          <button
            type="button"
            key={amt}
            onClick={() => setAmount(amt)}
            className="rounded-md border border-border/70 py-1.5 text-b-4 font-medium text-gray hover:border-primary/50 hover:text-white"
          >
            {amt}
          </button>
        ))}
      </div>

      <p className="text-b-5 text-gray">1 SOL ≈ 438.7K TikTok</p>

      <Button className="h-12 w-full text-b-1 font-semibold">Buy</Button>

      <div className="flex items-center justify-between text-b-5 text-gray">
        <span className="flex items-center gap-1">
          <Zap className="size-3" /> Auto
        </span>
        <span>0.006039</span>
        <span className="flex items-center gap-1">
          <Repeat className="size-3" />
          {"<0.01"}
        </span>
        <span>Red.</span>
        <ChevronDown className="size-3" />
      </div>
    </div>
  );
}
