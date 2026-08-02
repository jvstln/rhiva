"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LiquidityPool } from "../../liquidity.type";
import { usePoolTokenBalances } from "../../liquidity.hook";
import {
  formatBalance,
  formatPrice,
  getActiveBinIndex,
  getLiquidityBars,
  getPoolPriceInQuote,
  getPoolTokens,
  getPriceLabels,
  getTokenBalance,
} from "../../liquidity.util";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MODES = ["Spot", "Curve", "Bid-Ask"] as const;
const RATIO_PRESETS = ["50:50", "75:25", "40:60"] as const;
const BARS_COUNT = 42;

export function PoolTradeForm({ pool }: { pool: LiquidityPool }) {
  const [mode, setMode] = useState<(typeof MODES)[number]>("Spot");
  const [token, setToken] = useState<"base" | "quote">("base");
  const [ratio, setRatio] = useState(50);

  const { base, quote } = getPoolTokens(pool);
  const priceInQuote = getPoolPriceInQuote(pool);
  const bars = getLiquidityBars(pool, BARS_COUNT);
  const activeIndex = getActiveBinIndex(bars, pool.active_id);
  const activeBinId = bars[activeIndex]?.bin_id ?? 0;
  const priceLabels = getPriceLabels(bars, 7);
  const centerPct =
    bars.length > 1 ? (activeIndex / (bars.length - 1)) * 100 : 50;

  const { data: balances } = usePoolTokenBalances(pool);
  const activeToken = token === "base" ? base : quote;
  const balance = getTokenBalance(balances, activeToken.mint);

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
        <Field>
          <FieldLabel>Trade amount</FieldLabel>
          <InputGroup>
            <InputGroupInput defaultValue="0.0" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{activeToken.symbol}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center justify-between gap-2">
            <FieldDescription>
              Balance: {formatBalance(balance)} {activeToken.symbol}
            </FieldDescription>

            <ToggleGroup
              size={"sm"}
              onValueChange={([value]) => value}
            >
              {[25, 50, 100].map((pct) => (
                <ToggleGroupItem
                  key={pct}
                  value={String(pct)}
                >
                  {pct}%
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </Field>
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
          <span>
            {ratio}% {base.symbol}
          </span>
          <span>
            {100 - ratio}% {quote.symbol}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <TokenToggle
            label={base.symbol}
            active={token === "base"}
            onClick={() => setToken("base")}
          />
          <TokenToggle
            label={quote.symbol}
            active={token === "quote"}
            onClick={() => setToken("quote")}
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
            Custom ratio
          </button>
        </div>
      </div>

      <div>
        <p className="text-center text-b-3 text-gray">
          Current Price:{" "}
          <span className="font-medium text-white">
            {formatPrice(priceInQuote)} {quote.symbol} per {base.symbol}
          </span>
        </p>

        <div className="relative mt-4">
          <div className="flex h-16 items-end gap-[1px]">
            {bars.length > 0 ? (
              // TODO: The Spot/Curve/Bid-Ask deposit strategy shape isn't
              // returned by the API — bars render the pool's real liquidity
              // distribution instead of the user's projected deposit curve.
              bars.map((bar) => (
                <span
                  key={bar.bin_id}
                  className={cn(
                    "flex-1",
                    bar.bin_id <= activeBinId ? "bg-violet-600" : "bg-primary",
                  )}
                  style={{ height: `${Math.max(4, bar.height * 100)}%` }}
                />
              ))
            ) : (
              <span className="flex h-full w-full items-center justify-center text-b-4 text-gray">
                {/* TODO: Liquidity distribution isn't available for this pool. */}
                No liquidity data
              </span>
            )}
          </div>
          {/* Center line at current price */}
          <div
            className="absolute top-[-10px] bottom-0 w-0.5 -translate-x-1/2 bg-white"
            style={{ left: `${centerPct}%` }}
          />

          {/* Bottom solid bar */}
          <div className="h-1 w-full bg-primary" />

          {/* End markers */}
          <div className="absolute bottom-[-4px] left-0 h-3 w-0.5 bg-white" />
          <div className="absolute right-0 bottom-[-4px] h-3 w-0.5 bg-white" />
        </div>

        {priceLabels.length > 0 && (
          <div className="mt-1 flex justify-between text-b-6 text-gray">
            {priceLabels.map((price) => (
              <span key={price}>{formatPrice(price, 4)}</span>
            ))}
          </div>
        )}
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
