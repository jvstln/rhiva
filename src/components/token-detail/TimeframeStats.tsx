"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const TIMEFRAMES = [
  { key: "1m", change: "0%" },
  { key: "5m", change: "0%" },
  { key: "1h", change: "0%" },
  { key: "24h", change: "+10.1K%" },
] as const;

const SUMMARY = [
  { label: "Vol", value: "$0" },
  { label: "Buys", value: "0/$0" },
  { label: "Sells", value: "0/$0" },
  { label: "Net Buy", value: "$0" },
];

export function TimeframeStats() {
  const [active, setActive] =
    useState<(typeof TIMEFRAMES)[number]["key"]>("5m");

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {TIMEFRAMES.map((tf) => (
          <button
            type="button"
            key={tf.key}
            onClick={() => setActive(tf.key)}
            className={cn(
              "rounded-md border px-2 py-1.5 text-center transition-colors",
              active === tf.key
                ? "border-white/20 bg-secondary"
                : "border-transparent",
            )}
          >
            <p className="text-b-3 font-semibold text-white">{tf.key}</p>
            <p
              className={cn(
                "text-b-4",
                tf.change.startsWith("+") ? "text-up" : "text-gray",
              )}
            >
              {tf.change}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {SUMMARY.map((s) => (
          <div key={s.label}>
            <p className="text-b-5 text-gray">{s.label}</p>
            <p className="text-b-4 font-medium text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
