"use client";

import { useState } from "react";

import { capitalize } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LiquidityPool } from "../liquidity.type";
import { usePoolTokenBalances } from "../liquidity.hook";
import {
  formatPrice,
  getPoolPriceInQuote,
  getPoolTokens,
  getTokenBalance,
} from "../liquidity.util";
import {
  CurrentPrice,
  DepositAmount,
  LiquidityDepthChart,
  OpenPositionButton,
  SummaryFees,
  YieldDepositCard,
} from "./detail/trade-rail-shared";

const TABS = ["spot"] as const;
type Tab = (typeof TABS)[number];

const PRICE_PRESETS = ["± 1%", "± 5%", "± 10%", "Custom"] as const;

const parsePreset = (label: string): number | null => {
  if (label === "Custom") return null;
  return Number(label.replace(/[^0-9.]/g, "")) / 100;
};

export function RaydiumTradeRail({ pool }: { pool: LiquidityPool }) {
  const [tab, setTab] = useState<Tab>("spot");

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as Tab)}
    >
      <TabsList
        className="w-full"
        variant={"line"}
      >
        {TABS.map((t) => (
          <TabsTrigger
            key={t}
            value={t}
          >
            {capitalize(t)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="spot">
        <RaydiumSpotTab pool={pool} />
      </TabsContent>
    </Tabs>
  );
}

function RaydiumSpotTab({ pool }: { pool: LiquidityPool }) {
  const { base, quote } = getPoolTokens(pool);
  const price = getPoolPriceInQuote(pool);
  const { data: balances } = usePoolTokenBalances(pool);

  const basePct = pool.tvl_distribution?.base_pct ?? 50;
  const quotePct = pool.tvl_distribution?.quote_pct ?? 50;

  const [preset, setPreset] = useState<string>("± 10%");
  const [minText, setMinText] = useState("");
  const [maxText, setMaxText] = useState("");

  const spread = parsePreset(preset);
  const current = price ?? 0;
  const minPrice =
    spread != null ? current * (1 - spread) : parseFloat(minText) || current;
  const maxPrice =
    spread != null ? current * (1 + spread) : parseFloat(maxText) || current;

  const applyPreset = (next: string) => {
    setPreset(next);
    if (next === "Custom") return;
    const spread = parsePreset(next)!;
    setMinText((current * (1 - spread)).toFixed(4));
    setMaxText((current * (1 + spread)).toFixed(4));
  };

  const onMinChange = (value: string) => {
    setPreset("Custom");
    setMinText(value);
  };

  const onMaxChange = (value: string) => {
    setPreset("Custom");
    setMaxText(value);
  };

  const minOffset =
    current > 0 && minPrice > 0
      ? `-${(((current - minPrice) / current) * 100).toFixed(1)}%`
      : "—";
  const maxOffset =
    current > 0 && maxPrice > 0
      ? `+${(((maxPrice - current) / current) * 100).toFixed(1)}%`
      : "—";

  return (
    <div className="fade-in animate-in space-y-6 p-4 duration-300">
      <CurrentPrice
        price={price}
        baseSymbol={base.symbol}
        quoteSymbol={quote.symbol}
      />

      <LiquidityDepthChart pool={pool} />

      <div className="mt-6 space-y-3">
        <span className="text-b-4 text-gray">Price Range</span>
        <ToggleGroup
          variant="outline"
          value={[preset]}
          onValueChange={([value]) => value && applyPreset(value)}
          className={"w-full *:flex-1"}
        >
          {PRICE_PRESETS.map((p) => (
            <ToggleGroupItem
              key={p}
              value={p}
            >
              {p}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-b-4 text-gray">Min Price</span>
          <div className="flex overflow-hidden rounded-xl border border-border/40 bg-secondary/30">
            <input
              type="text"
              inputMode="decimal"
              value={preset === "Custom" ? minText : formatPrice(minPrice, 4)}
              onChange={(e) => onMinChange(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
            />
            <div className="flex items-center whitespace-nowrap border-border/40 border-l bg-white/5 px-4 text-gray text-sm">
              {minOffset}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-b-4 text-gray">Max Price</span>
          <div className="flex overflow-hidden rounded-xl border border-border/40 bg-secondary/30">
            <input
              type="text"
              inputMode="decimal"
              value={preset === "Custom" ? maxText : formatPrice(maxPrice, 4)}
              onChange={(e) => onMaxChange(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
            />
            <div className="flex items-center whitespace-nowrap border-border/40 border-l bg-white/5 px-4 text-gray text-sm">
              {maxOffset}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <YieldDepositCard
          baseSymbol={base.symbol}
          quoteSymbol={quote.symbol}
          basePct={basePct}
          quotePct={quotePct}
        />
      </div>

      <DepositAmount
        symbol={base.symbol}
        balance={getTokenBalance(balances, base.mint)}
        priceUsd={base.priceUsd}
        decimals={base.decimals}
      />

      <SummaryFees pool={pool} />

      <OpenPositionButton />
    </div>
  );
}
