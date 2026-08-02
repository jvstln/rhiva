"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { formatCompactCurrency } from "@/lib/finance.util";
import { cn } from "@/lib/utils";

const TOKEN_INFO_KEYS = ["15m", "5m", "1h", "24h"] as const;

export function PoolVolumeAndTvl({ pool }: { pool: LiquidityPool }) {
  const baseSymbol =
    pool.token_a?.symbol ||
    pool.base_symbol ||
    `${pool.token_a?.mint.slice(0, 6) ?? "Base"}...`;
  const quoteSymbol = pool.token_b?.symbol || "SOL";

  const [tokenTab, setTokenTab] = useState<string>(baseSymbol);

  const baseUsd = pool.tvl_distribution?.base_usd ?? 0;
  const quoteUsd = pool.tvl_distribution?.quote_usd ?? 0;
  const basePct = pool.tvl_distribution?.base_pct ?? 0;
  const quotePct = pool.tvl_distribution?.quote_pct ?? 0;
  const totalPct = basePct + quotePct || 1;

  // TODO: Historical volume chart series is built from token_stats windows
  // because a dedicated pool volume time-series endpoint is not available.
  const poolWindows = pool.token_stats?.windows;
  const volumeSeries = poolWindows
    ? (["5m", "15m", "30m", "1h", "6h", "12h", "24h"] as const)
        .filter((k) => k in poolWindows)
        .map((k) => ({ day: k, volume: poolWindows[k]?.volume_usd ?? 0 }))
    : [];

  // Get active token's timeframe stats based on token tab selection
  const activeStats =
    tokenTab === baseSymbol
      ? (pool.token_a?.timeframes ?? pool.token_stats)
      : pool.token_b?.timeframes;

  const activeWindows = activeStats?.windows;

  // Token info columns for the selected token
  const tokenInfoCols = TOKEN_INFO_KEYS.map((k) => {
    const w = activeWindows?.[k as keyof typeof activeWindows];
    return {
      label: k,
      value: w ? formatCompactCurrency(w.volume_usd) : "N/A",
      sub: w
        ? `${w.price_change_pct >= 0 ? "+" : ""}${w.price_change_pct.toFixed(2)}%`
        : undefined,
      subTone:
        w && w.price_change_pct < 0 ? ("down" as const) : ("up" as const),
    };
  });

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="font-medium text-b-3 text-white">Volume</p>
        <p className="mt-1 font-bold text-h6 text-white">
          {formatCompactCurrency(pool.volume_24h_usd)}
        </p>
        <div className="mt-2 h-24 w-full">
          {volumeSeries.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={volumeSeries}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="volFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "var(--gray)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#volFill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            // TODO: Time-series volume windows are unavailable for this pool.
            <div className="flex h-full items-center justify-center text-b-5 text-gray">
              No volume chart data
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="font-medium text-b-3 text-white">TVL Distribution</p>
        <p className="mt-2 flex items-center gap-4 text-b-5 text-gray">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-violet-500" /> {baseSymbol}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" /> {quoteSymbol}
          </span>
        </p>
        <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-secondary">
          <span
            className="h-full bg-violet-500"
            style={{ width: `${(basePct / totalPct) * 100}%` }}
          />
          <span
            className="h-full bg-primary"
            style={{ width: `${(quotePct / totalPct) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-b-4">
          <span className="text-white">
            {formatCompactCurrency(baseUsd)}{" "}
            <span className="text-gray">{basePct.toFixed(1)}%</span>
          </span>
          <span className="text-white">
            {formatCompactCurrency(quoteUsd)}{" "}
            <span className="text-gray">{quotePct.toFixed(1)}%</span>
          </span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium text-b-3 text-white">Token Info</p>
          <div className="flex rounded-md bg-secondary p-0.5">
            {[baseSymbol, quoteSymbol].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTokenTab(t)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium text-b-5",
                  tokenTab === t ? "bg-background text-white" : "text-gray",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {tokenInfoCols.map((col) => (
            <div key={col.label}>
              <p className="text-b-5 text-gray">{col.label}</p>
              <p className="font-medium text-b-4 text-white">{col.value}</p>
              {col.sub && (
                <p
                  className={cn(
                    "text-b-5",
                    col.subTone === "down" ? "text-down" : "text-up",
                  )}
                >
                  {col.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
