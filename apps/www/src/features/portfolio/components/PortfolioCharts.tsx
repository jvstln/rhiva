"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  WalletPnlHistory,
  WalletPnlPerformance,
} from "@rhivadotfun/dataapi";
import { formatCompactCurrency } from "@/lib/finance.util";

type PortfolioChartsProps = {
  history?: WalletPnlHistory[];
  performance?: WalletPnlPerformance<any>;
};

export const PortfolioCharts = ({
  history,
  performance,
}: PortfolioChartsProps) => {
  const valueChartData = useMemo(() => {
    if (history && history.length > 0) {
      return history.map((item, idx) => ({
        day: idx + 4,
        value: item.volume_usd > 0 ? item.volume_usd : (idx + 1) * 20_000,
      }));
    }
    return [
      { day: 4, value: 25_000 },
      { day: 5, value: 104_300 },
    ];
  }, [history]);

  const pnlBarData = useMemo(() => {
    if (history && history.length > 0) {
      return history.map((item, idx) => ({
        day: idx + 4,
        pnl: item.realized_usd,
      }));
    }
    return [
      { day: 4, pnl: 40_000 },
      { day: 5, pnl: 67_100 },
    ];
  }, [history]);

  const p1d = performance?.windows?.["1d"] ?? {
    realized_usd: 67_100,
    trades: 36_568,
    wins: 117,
    losses: 82,
  };
  const p7d = performance?.windows?.["7d"] ?? {
    realized_usd: 106_400,
    trades: 75_764,
    wins: 236,
    losses: 171,
  };
  const p30d = performance?.windows?.["30d"] ?? {
    realized_usd: 106_400,
    trades: 75_764,
    wins: 236,
    losses: 171,
  };

  const maxDrawdown = performance?.max_drawdown_pct ?? 0;
  const bestDay = performance?.best_day_usd ?? 67_100;
  const worstDay = performance?.worst_day_usd ?? 39_200;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Card 1: Portfolio value */}
      <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
        <span className="font-semibold text-sm text-white">
          Portfolio value
        </span>

        <div className="h-44 w-full pt-3">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={valueChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="valueGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#eab308"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="#eab308"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 11 }}
              />
              <YAxis
                hide
                domain={["dataMin - 5000", "dataMax + 5000"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="rounded border border-border/80 bg-background/95 px-2.5 py-1 text-xs shadow-md">
                        <p className="font-medium text-white">
                          {formatCompactCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#valueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 2: Realized PnL per day */}
      <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
        <span className="font-semibold text-sm text-white">
          Realized PnL per day
        </span>

        <div className="h-44 w-full pt-3">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={pnlBarData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 11 }}
              />
              <YAxis
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10 }}
                tickFormatter={(val) => formatCompactCurrency(val)}
                domain={[0, "auto"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="rounded border border-border/80 bg-background/95 px-2.5 py-1 text-xs shadow-md">
                        <p className="font-semibold text-up">
                          {formatCompactCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="pnl"
                fill="#22c55e"
                radius={[2, 2, 0, 0]}
                barSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 3: Performance */}
      <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 text-xs backdrop-blur-sm">
        <span className="font-semibold text-sm text-white">Performance</span>

        <div className="flex flex-col gap-2.5 pt-2">
          {/* 1d */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">1d</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-up">
                {formatCompactCurrency(p1d.realized_usd)}
              </span>
              <span className="text-muted-foreground">
                {p1d.trades} tx · {p1d.wins}W/{p1d.losses}L
              </span>
            </div>
          </div>

          {/* 7d */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">7d</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-up">
                {formatCompactCurrency(p7d.realized_usd)}
              </span>
              <span className="text-muted-foreground">
                {p7d.trades} tx · {p7d.wins}W/{p7d.losses}L
              </span>
            </div>
          </div>

          {/* 30d */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">30d</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-up">
                {formatCompactCurrency(p30d.realized_usd)}
              </span>
              <span className="text-muted-foreground">
                {p30d.trades} tx · {p30d.wins}W/{p30d.losses}L
              </span>
            </div>
          </div>

          <div className="my-1 border-border/40 border-t" />

          {/* Max drawdown */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Max drawdown</span>
            <span
              className={`font-semibold ${maxDrawdown > 0 ? "text-down" : "text-white"}`}
            >
              {maxDrawdown}%
            </span>
          </div>

          {/* Best / worst day */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Best / worst day</span>
            <span className="font-semibold">
              <span className="text-up">{formatCompactCurrency(bestDay)}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="text-down">
                {formatCompactCurrency(worstDay)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
