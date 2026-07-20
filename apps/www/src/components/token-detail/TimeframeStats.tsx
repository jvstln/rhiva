"use client";

import { useState } from "react";

import type { Token } from "@/features/market/market.token.type";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/finance.util";
import { cn } from "@/lib/utils";

type TimeframeStatsProps = { token: Token };

const TIMEFRAMES = ["1m", "5m", "1h", "24h"] as const;

type TimeframeKey = (typeof TIMEFRAMES)[number];

function getMetricValue(
  token: Token,
  timeframe: TimeframeKey,
  metric: "volume" | "buy" | "sell" | "trade" | "volume_buy" | "volume_sell",
) {
  const frame = token.timeframes?.[timeframe];
  if (!frame) return undefined;

  switch (metric) {
    case "volume":
      return frame.volume_usd;
    case "buy":
      return frame.buy;
    case "sell":
      return frame.sell;
    case "trade":
      return frame.trade_count;
    case "volume_buy":
      return frame.volume_buy_usd;
    case "volume_sell":
      return frame.volume_sell_usd;
  }
}

export function TimeframeStats({ token }: TimeframeStatsProps) {
  const [active, setActive] = useState<TimeframeKey>("5m");

  const volume = getMetricValue(token, active, "volume");
  const buys = getMetricValue(token, active, "buy");
  const sells = getMetricValue(token, active, "sell");
  const change = token.timeframes?.[active]?.price_change_percent;

  const summary = [
    {
      label: "Vol",
      value: volume !== undefined ? formatCompactCurrency(volume) : "N/A",
    },
    {
      label: "Buys",
      value:
        buys !== undefined
          ? `${formatCompactNumber(buys)} / ${volume !== undefined ? formatCompactCurrency(getMetricValue(token, active, "volume_buy") ?? 0) : "N/A"}`
          : "N/A",
    },
    {
      label: "Sells",
      value:
        sells !== undefined
          ? `${formatCompactNumber(sells)} / ${volume !== undefined ? formatCompactCurrency(getMetricValue(token, active, "volume_sell") ?? 0) : "N/A"}`
          : "N/A",
    },
    {
      label: "Net Buy",
      value:
        volume !== undefined
          ? formatCompactCurrency((buys ?? 0) - (sells ?? 0))
          : "N/A",
    },
  ];

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {TIMEFRAMES.map((tf) => {
          const tfChange = token.timeframes?.[tf]?.price_change_percent;
          return (
            <button
              type="button"
              key={tf}
              onClick={() => setActive(tf)}
              className={cn(
                "rounded-md border px-2 py-1.5 text-center transition-colors",
                active === tf
                  ? "border-white/20 bg-secondary"
                  : "border-transparent",
              )}
            >
              <p className="font-semibold text-b-3 text-white">{tf}</p>
              <p
                className={cn(
                  "text-b-4",
                  tfChange !== undefined && tfChange !== null && tfChange > 0
                    ? "text-up"
                    : "text-gray",
                )}
              >
                {tfChange !== undefined ? formatSignedPercent(tfChange) : "N/A"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {summary.map((s) => (
          <div key={s.label}>
            <p className="text-b-5 text-gray">{s.label}</p>
            <p className="font-medium text-b-4 text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border/70 bg-surface-2/50 px-3 py-2 text-center text-b-4 text-gray">
        <span className="text-white">{active} move:</span>{" "}
        {change !== undefined ? formatSignedPercent(change) : "N/A"}
      </div>
    </div>
  );
}
