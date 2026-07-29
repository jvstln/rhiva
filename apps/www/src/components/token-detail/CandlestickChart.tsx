"use client";

import {
  Bar,
  BarChart,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Candle } from "@/components/ui/data/token-detail-data";

interface CandleShapeProps {
  x?: number;
  width?: number;
  payload?: Candle;
  yAxis?: { scale: (v: number) => number };
}

function CandleShape({ x, width, payload, yAxis }: CandleShapeProps) {
  if (x === undefined || width === undefined || !payload || !yAxis) return null;

  const up = payload.close >= payload.open;
  const color = up ? "var(--color-up)" : "var(--color-down)";
  const scale = yAxis.scale;

  const yHigh = scale(payload.high);
  const yLow = scale(payload.low);
  const yOpen = scale(payload.open);
  const yClose = scale(payload.close);
  const bodyTop = Math.min(yOpen, yClose);
  const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1);
  const cx = x + width / 2;

  return (
    <g>
      <line
        x1={cx}
        x2={cx}
        y1={yHigh}
        y2={yLow}
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x={x}
        y={bodyTop}
        width={width}
        height={bodyHeight}
        fill={color}
        rx={1}
      />
    </g>
  );
}

export function CandlestickChart({ data }: { data: Candle[] }) {
  return (
    <div className="flex flex-col">
      <div className="h-[340px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 56, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              hide
            />
            <YAxis
              domain={["dataMin - 0.00002", "dataMax + 0.00002"]}
              orientation="right"
              width={56}
              tick={{ fill: "var(--gray)", fontSize: 10 }}
              tickFormatter={(v: number) => v.toFixed(5)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "var(--border)" }}
            />
            {/* Custom candle shape via loosely-typed recharts shape prop */}
            <Bar
              dataKey="high"
              shape={CandleShape}
              isAnimationActive={false}
              barSize={10}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[90px] w-full border-border/70 border-t">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{ top: 8, right: 56, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              tick={{ fill: "var(--gray)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Bar
              dataKey="volume"
              isAnimationActive={false}
              radius={[1, 1, 0, 0]}
              fill="var(--color-up)"
              fillOpacity={0.35}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
