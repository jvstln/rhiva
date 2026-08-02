"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCompactCurrency } from "@/lib/finance.util";
import { cn } from "@/lib/utils";
import type { LiquidityPool } from "../../liquidity.type";
import {
  getActiveBinIndex,
  getPriceLabels,
  type LiquidityBar,
} from "../../liquidity.util";

export function InfoRow({
  label,
  value,
  isTag = false,
}: {
  label: string;
  value: string;
  isTag?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-b-4">
      <div className="flex items-center gap-2 text-gray">
        {label}
        {isTag && (
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
            24H
          </span>
        )}
      </div>
      <span className="text-white">{value}</span>
    </div>
  );
}

export function SummaryFees({ pool }: { pool: LiquidityPool }) {
  const totalFee = Number(pool.total_fee_pct ?? 0);
  const feeLabel = totalFee > 0 ? `${totalFee}%` : `${pool.bin_step ?? 0}bps`;

  return (
    <div className="space-y-3 pt-2">
      {/* TODO: Estimated yield isn't returned by the API — needs a yield projection model. */}
      <InfoRow
        label="Estimated Yield"
        value="-"
        isTag
      />
      <div className="my-4 h-px w-full bg-border/40" />
      <InfoRow
        label="Total Fee"
        value={feeLabel}
      />
      <InfoRow
        label="Bin Step"
        value={`${pool.bin_step ?? 0}bps`}
      />
      {/* TODO: Non-refundable vs refundable fee breakdown isn't provided by the backend. */}
      <InfoRow
        label="Non-Refundable Fees"
        value="-"
      />
      <InfoRow
        label="Refundable Fees"
        value="-"
      />
    </div>
  );
}

export function YieldDepositCard({
  baseSymbol,
  quoteSymbol,
  basePct,
  quotePct,
}: {
  baseSymbol: string;
  quoteSymbol: string;
  basePct: number;
  quotePct: number;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/70 p-4">
      {/* TODO: Yield projection isn't available; deposit split comes from the pool's TVL distribution. */}
      <InfoRow
        label="Estimated Yield"
        value="-"
        isTag
      />
      <InfoRow
        label="Deposit"
        value={`${basePct.toFixed(1)}% ${baseSymbol} / ${quotePct.toFixed(1)}% ${quoteSymbol}`}
      />
    </div>
  );
}

export function TokenAvatar({ symbol }: { symbol: string }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr from-purple-500 to-cyan-500 font-bold text-[10px] text-white shadow-sm">
      {symbol[0] ?? "?"}
    </div>
  );
}

export function LiquidityDepthChart({
  bars,
  activeId,
}: {
  bars: LiquidityBar[];
  activeId?: number;
}) {
  const activeIndex = getActiveBinIndex(bars, activeId);
  const half = Math.max(1, Math.round(bars.length / 10));
  const left = Math.max(0, activeIndex - half);
  const right = Math.min(bars.length - 1, activeIndex + half);
  const leftPct = bars.length > 1 ? (left / (bars.length - 1)) * 100 : 50;
  const rightPct = bars.length > 1 ? (right / (bars.length - 1)) * 100 : 50;

  if (!bars.length) {
    return (
      <div className="relative mt-2 flex h-24 w-full items-end justify-center rounded-xl border border-border/70 bg-secondary/30 text-b-4 text-gray">
        {/* TODO: Liquidity distribution isn't available for this pool. */}
        No liquidity data
      </div>
    );
  }

  return (
    <div className="relative mt-2 flex h-24 w-full items-end gap-[1px]">
      {bars.map((bar, i) => (
        <div
          key={bar.bin_id}
          className={cn(
            "flex-1",
            i >= left && i <= right ? "bg-primary" : "bg-white/20",
          )}
          style={{ height: `${Math.max(4, bar.height * 100)}%` }}
        />
      ))}
      {/* Bottom bar */}
      <div className="absolute right-0 bottom-[-4px] left-0 flex h-1">
        <div
          className="flex-1 bg-white/20"
          style={{ flexGrow: left + 1 }}
        />
        <div
          className="flex-1 bg-primary"
          style={{ flexGrow: Math.max(1, right - left + 1) }}
        />
        <div
          className="flex-1 bg-white/20"
          style={{ flexGrow: bars.length - right }}
        />
      </div>
      {/* Handles */}
      <div
        className="absolute top-0 bottom-[-16px] z-10 w-0.5 bg-white"
        style={{ left: `${leftPct}%` }}
      />
      <div
        className="absolute top-0 bottom-[-16px] z-10 w-0.5 bg-white"
        style={{ left: `${rightPct}%` }}
      />
      <div
        className="absolute bottom-[-16px] h-4 w-1.5 -translate-x-1/2 rounded-sm bg-white"
        style={{ left: `${leftPct}%` }}
      />
      <div
        className="absolute bottom-[-16px] h-4 w-1.5 -translate-x-1/2 rounded-sm bg-white"
        style={{ left: `${rightPct}%` }}
      />
    </div>
  );
}

export function PriceTickerLabels({
  bars,
  count = 7,
}: {
  bars: LiquidityBar[];
  count?: number;
}) {
  const labels = getPriceLabels(bars, count);
  if (!labels.length) return null;

  return (
    <div className="mt-4 flex justify-between text-[10px] text-white">
      {labels.map((price) => (
        <span key={price}>{price.toExponential(4)}</span>
      ))}
    </div>
  );
}

export function TradeAmountField({
  symbol,
  balance,
  priceUsd,
  decimals,
}: {
  symbol: string;
  balance: number;
  priceUsd: number | null;
  decimals: number | null;
}) {
  const [amount, setAmount] = useState("");
  const value = parseFloat(amount) || 0;
  const usd = priceUsd == null ? null : value * priceUsd;
  const maxDigits = Math.min(decimals ?? 6, 6);

  const setPct = (pct: number) => {
    const next = balance * pct;
    setAmount(next > 0 ? next.toFixed(maxDigits) : "0");
  };

  return (
    <div className="space-y-3">
      <div className="relative flex min-h-[100px] flex-col justify-center rounded-xl border border-border/70 bg-secondary/30 p-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent font-semibold text-2xl text-white outline-none"
          />
          <div className="flex items-center gap-2">
            <TokenAvatar symbol={symbol} />
            <span className="font-semibold text-sm text-white">{symbol}</span>
          </div>
        </div>
        <div className="mt-1 text-b-4 text-gray">
          {usd == null ? "-" : formatCompactCurrency(usd)}
        </div>
      </div>

      <div className="flex items-center justify-between text-b-4 text-gray">
        <span>
          Balance:{" "}
          {balance.toLocaleString("en-US", {
            maximumFractionDigits: maxDigits,
          })}{" "}
          {symbol}
        </span>
        <div className="flex items-center gap-3">
          {([0.25, 0.5, 1] as const).map((pct) => (
            <button
              type="button"
              key={pct}
              onClick={() => setPct(pct)}
              className={cn(
                "hover:text-white",
                pct === 1 && "font-medium text-primary",
              )}
            >
              {pct === 1 ? "Max" : `${pct * 100}%`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OpenPositionButton() {
  return (
    <div className="sticky bottom-4 bg-background py-2">
      <Button className="w-full">Open Position</Button>
    </div>
  );
}
