"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import {
  POOL_DETAIL,
  TOKEN_INFO_COLUMNS,
  VOLUME_SERIES,
} from "@/components/ui/data/liquidity-detail-data";
import { cn } from "@/lib/utils";

export function PoolVolumeAndTvl() {
  const [tokenTab, setTokenTab] = useState<"USDC" | "SOL">("USDC");
  const { tvlUsdc, tvlSol } = POOL_DETAIL;
  const totalPct = parseFloat(tvlUsdc.pct) + parseFloat(tvlSol.pct) || 1;

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="font-medium text-b-3 text-white">Volume</p>
        <p className="mt-1 font-bold text-h6 text-white">
          {POOL_DETAIL.volume}
        </p>
        <div className="mt-2 h-24 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={VOLUME_SERIES}
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
        </div>
      </div>

      <div>
        <p className="font-medium text-b-3 text-white">TVL Distribution</p>
        <p className="mt-2 flex items-center gap-4 text-b-5 text-gray">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" /> USDC
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-violet-500" /> SOL
          </span>
        </p>
        <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-secondary">
          <span
            className="h-full bg-primary"
            style={{ width: `${(parseFloat(tvlUsdc.pct) / totalPct) * 100}%` }}
          />
          <span
            className="h-full bg-violet-500"
            style={{ width: `${(parseFloat(tvlSol.pct) / totalPct) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-b-4">
          <span className="text-white">
            {tvlUsdc.value} <span className="text-gray">{tvlUsdc.pct}</span>
          </span>
          <span className="text-white">
            {tvlSol.value} <span className="text-gray">{tvlSol.pct}</span>
          </span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium text-b-3 text-white">Token Info</p>
          <div className="flex rounded-md bg-secondary p-0.5">
            {(["USDC", "SOL"] as const).map((t) => (
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
          {TOKEN_INFO_COLUMNS.map((col, i) => (
            <div key={i}>
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
