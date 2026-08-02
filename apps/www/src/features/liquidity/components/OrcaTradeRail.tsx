"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { LiquidityPool } from "../liquidity.type";
import { usePoolTokenBalances } from "../liquidity.hook";
import {
  formatPrice,
  getLiquidityBars,
  getPoolPriceInQuote,
  getPoolTokens,
  getTokenBalance,
} from "../liquidity.util";
import {
  LiquidityDepthChart,
  OpenPositionButton,
  PriceTickerLabels,
  SummaryFees,
  TradeAmountField,
  YieldDepositCard,
} from "./detail/trade-rail-shared";

const TABS = ["full", "custom"] as const;
type Tab = (typeof TABS)[number];

export function OrcaTradeRail({ pool }: { pool: LiquidityPool }) {
  const [tab, setTab] = useState<Tab>("full");

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

      {tab === "full" ? (
        <OrcaFullTab pool={pool} />
      ) : (
        <OrcaCustomTab pool={pool} />
      )}
    </Tabs>
  );
}

function OrcaFullTab({ pool }: { pool: LiquidityPool }) {
  const { base, quote } = getPoolTokens(pool);
  const basePct = pool.tvl_distribution?.base_pct ?? 50;
  const quotePct = pool.tvl_distribution?.quote_pct ?? 50;
  const { data: balances } = usePoolTokenBalances(pool);

  return (
    <div className="fade-in animate-in space-y-6 duration-300">
      <YieldDepositCard
        baseSymbol={base.symbol}
        quoteSymbol={quote.symbol}
        basePct={basePct}
        quotePct={quotePct}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-b-4 text-gray">Deposit Amount</span>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
          >
            <SlidersHorizontal />
          </Button>
        </div>

        <TradeAmountField
          symbol={base.symbol}
          balance={getTokenBalance(balances, base.mint)}
          priceUsd={base.priceUsd}
          decimals={base.decimals}
        />
      </div>

      <SummaryFees pool={pool} />

      <OpenPositionButton />
    </div>
  );
}

function OrcaCustomTab({ pool }: { pool: LiquidityPool }) {
  const [tradeType, setTradeType] = useState<"full" | "single">("full");
  const [selectedCurrency, setSelectedCurrency] = useState<"base" | "quote">(
    "base",
  );

  const { base, quote } = getPoolTokens(pool);
  const priceInQuote = getPoolPriceInQuote(pool);
  const bars = getLiquidityBars(pool, 60);
  const { data: balances } = usePoolTokenBalances(pool);

  const activeToken = selectedCurrency === "base" ? base : quote;
  const activePct =
    tradeType === "full"
      ? (pool.tvl_distribution?.base_pct ?? 50)
      : selectedCurrency === "base"
        ? 100
        : 0;
  const quotePct =
    tradeType === "full"
      ? (pool.tvl_distribution?.quote_pct ?? 50)
      : selectedCurrency === "base"
        ? 0
        : 100;

  return (
    <div className="fade-in animate-in space-y-6 duration-300">
      <div className="text-center text-b-5 text-white">
        Current Price: {formatPrice(priceInQuote)} {quote.symbol} per{" "}
        {base.symbol}
      </div>

      <LiquidityDepthChart
        bars={bars}
        activeId={pool.active_id}
      />

      <PriceTickerLabels bars={bars} />

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-b-4 text-gray">Trade amount</span>
          <ToggleGroup
            size="sm"
            value={[tradeType]}
            onValueChange={([value]) => setTradeType(value as typeof tradeType)}
            spacing={0}
          >
            <ToggleGroupItem value="full">Full-sided</ToggleGroupItem>
            <ToggleGroupItem value="single">Single-sided</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <TradeAmountField
          symbol={activeToken.symbol}
          balance={getTokenBalance(balances, activeToken.mint)}
          priceUsd={activeToken.priceUsd}
          decimals={activeToken.decimals}
        />

        <div className="flex gap-3 pt-2 *:flex-1">
          <Button
            variant={
              selectedCurrency === "base" || tradeType === "full"
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCurrency("base")}
          >
            {base.symbol}
          </Button>
          <Button
            variant={
              selectedCurrency === "quote" || tradeType === "full"
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCurrency("quote")}
          >
            {quote.symbol}
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <YieldDepositCard
          baseSymbol={base.symbol}
          quoteSymbol={quote.symbol}
          basePct={activePct}
          quotePct={quotePct}
        />
      </div>

      <SummaryFees pool={pool} />

      <OpenPositionButton />
    </div>
  );
}
