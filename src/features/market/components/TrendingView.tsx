"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertCircle,
  AlertTriangle,
  Copy,
  Crosshair,
  Crown,
  Eye,
  Flag,
  Gift,
  Globe,
  Landmark,
  Layers,
  Leaf,
  Search,
  Sprout,
  Star,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import type * as React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { mockTrendingPairs } from "@/data/market-trending-data";
import {
  arrayWithId,
  cn,
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/utils";

export interface TrendingPairMetric {
  id: string;
  label: string;
  value: number;
  tone: "safe" | "risk" | string;
  suffix?: string;
}

export interface TrendingPair {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  pairAddress: string;
  iconColors: string[];
  flagged: boolean;
  age: string;
  hasDevActivity: boolean;
  hasAlert: boolean;
  hasWebsite: boolean;
  hasNote: boolean;
  watcherCount: number;
  chart: { t: number; v: number }[];
  changePercent: number;
  marketCap: number;
  liquidity: number;
  volume: number;
  txnsTotal: number;
  txnsBuys: number;
  txnsSells: number;
  metrics: TrendingPairMetric[];
}

/* ------------------------------------------------------------------ */
/* Data fetching / Mock provider                                      */
/* ------------------------------------------------------------------ */

export function useTrendingPairs() {
  return {
    data: mockTrendingPairs as TrendingPair[],
    isLoading: false,
  };
}

/* ------------------------------------------------------------------ */
/* Token avatar (dual overlapping circles + caution badge)             */
/* ------------------------------------------------------------------ */

interface TokenIconProps {
  colors: string[];
  size?: number;
  flagged?: boolean;
}

function TokenIcon({ colors, size = 44, flagged }: TokenIconProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-lg border bg-black",
        flagged ? "border-roman/60" : "border-white/10",
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0">
        <span
          className="-translate-y-1/2 absolute top-1/2 size-[45%] rounded-full"
          style={{ backgroundColor: colors[0], left: "16%" }}
        />
        <span
          className="-translate-y-1/2 absolute top-1/2 size-[45%] rounded-full"
          style={{ backgroundColor: colors[1], right: "16%" }}
        />
      </div>

      {flagged && (
        <span className="-bottom-1 -right-1 absolute flex size-4 items-center justify-center rounded-full border border-roman/60 bg-black text-roman">
          <AlertTriangle className="size-2.5" />
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Favorite / watchlist star toggle                                    */
/* ------------------------------------------------------------------ */

function StarButton({ pairId: _pairId }: { pairId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsFavorite((prev) => !prev)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
        isFavorite ? "text-casablanca" : "text-white/20 hover:text-white/50",
      )}
    >
      <Star className="size-4" fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline chart (dependency-free SVG)                                */
/* ------------------------------------------------------------------ */

interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

function Sparkline({
  data,
  positive = true,
  width = 140,
  height = 44,
}: SparklineProps) {
  const { linePath, areaPath } = useMemo(() => {
    if (data.length < 2) return { linePath: "", areaPath: "" };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return [x, y];
    });

    const line = points
      .map(
        ([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
      )
      .join(" ");

    return {
      linePath: line,
      areaPath: `${line} L${width},${height} L0,${height} Z`,
    };
  }, [data, width, height]);

  const color = positive ? "var(--ocean-green)" : "var(--roman)";
  const gradientId = `sparkline-${positive ? "up" : "down"}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pair info cell (star, avatar, name, sub-icons, watcher count)       */
/* ------------------------------------------------------------------ */

interface SubIconProps {
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  activeClassName?: string;
  label?: string;
}

function SubIcon({ icon: Icon, active, activeClassName, label }: SubIconProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-3.5 items-center justify-center transition-colors hover:text-silver",
        active ? (activeClassName ?? "text-silver") : "text-white/15",
      )}
    >
      <Icon className="size-full" />
    </button>
  );
}

function PairInfoCell({ pair }: { pair: TrendingPair }) {
  return (
    <div className="flex items-center gap-3">
      <StarButton pairId={pair.id} />

      <TokenIcon colors={pair.iconColors} flagged={pair.flagged} />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-white">
            {pair.tokenName}
          </span>
          <span className="text-sm text-white/40">{pair.tokenSymbol}</span>
          <button
            type="button"
            aria-label="Copy token address"
            className="text-white/30 transition-colors hover:text-silver"
          >
            <Copy className="size-3" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-ocean-green text-xs">
            {pair.age}
          </span>
          <SubIcon
            icon={UserRound}
            active={pair.hasDevActivity}
            activeClassName="text-dodger-blue"
            label="Dev activity"
          />
          <SubIcon
            icon={AlertCircle}
            active={pair.hasAlert}
            activeClassName="text-casablanca"
            label="Alerts"
          />
          <SubIcon icon={Globe} active={pair.hasWebsite} label="Website" />
          <SubIcon icon={Flag} active={pair.hasNote} label="Add note" />
          <SubIcon icon={Search} active label="Inspect pair" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 self-stretch">
        <button
          type="button"
          aria-label="Copy pair address"
          className="text-white/25 transition-colors hover:text-silver"
        >
          <Copy className="size-3.5" />
        </button>
        <div className="mt-auto flex items-center gap-1 text-[11px] text-white/30">
          <Eye className="size-3" />
          {pair.watcherCount}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Market Cap / Liquidity / Volume cell                                 */
/* ------------------------------------------------------------------ */

interface MetricCellProps {
  value: string;
  changePercent?: number;
}

function MetricCell({ value, changePercent }: MetricCellProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-sm text-white">{value}</span>
      {changePercent !== undefined && (
        <span
          className={cn(
            "font-medium text-xs",
            changePercent >= 0 ? "text-ocean-green" : "text-roman",
          )}
        >
          {formatSignedPercent(changePercent)}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TXNS cell                                                            */
/* ------------------------------------------------------------------ */

interface TxnsCellProps {
  total: number;
  buys: number;
  sells: number;
}

function TxnsCell({ total, buys, sells }: TxnsCellProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-sm text-white">
        {formatCompactNumber(total)}
      </span>
      <span className="font-medium text-xs">
        <span className="text-ocean-green">{formatCompactNumber(buys)}</span>
        <span className="text-white/30"> / </span>
        <span className="text-roman">{formatCompactNumber(sells)}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Token security badge grid                                           */
/* ------------------------------------------------------------------ */

const METRIC_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  holders: UserRoundCheck,
  top10: Crown,
  airdrop: Gift,
  bundlers: Layers,
  devSold: Landmark,
  freshWallets: Leaf,
  lpBurned: Sprout,
};

function MetricPill({ metric }: { metric: TrendingPairMetric }) {
  const Icon = METRIC_ICONS[metric.id] ?? UserRoundCheck;
  const toneClass =
    metric.tone === "risk"
      ? "text-roman border-roman/40"
      : "text-ocean-green border-ocean-green/40";

  return (
    <div
      title={metric.label}
      className={cn(
        "flex h-6 items-center gap-1 rounded-md border bg-transparent px-1.5 font-medium text-[11px] tabular-nums",
        toneClass,
      )}
    >
      <Icon className="size-3 shrink-0" />
      <span>{metric.value}%</span>
      {metric.suffix && <span className="text-white/30">{metric.suffix}</span>}
    </div>
  );
}

function TokenSecurityBadges({ metrics }: { metrics: TrendingPairMetric[] }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {metrics.map((metric) => (
        <MetricPill key={metric.id} metric={metric} />
      ))}
      <button
        type="button"
        aria-label="View token security details"
        className="flex size-6 items-center justify-center rounded-md border border-roman/40 text-roman transition-colors hover:bg-roman/10"
      >
        <Crosshair className="size-3" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sell / Buy action buttons                                            */
/* ------------------------------------------------------------------ */

function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="sell" size="sm">
        Sell
      </Button>
      <Button variant="default" size="sm">
        Buy
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column definitions                                                   */
/* ------------------------------------------------------------------ */

const trendingColumns: ColumnDef<TrendingPair>[] = [
  {
    id: "pairInfo",
    header: "Pair Info",
    cell: ({ row }) => <PairInfoCell pair={row.original} />,
  },
  {
    id: "chart",
    header: () => <span className="sr-only">Chart</span>,
    cell: ({ row }) => (
      <Sparkline
        data={row.original.chart.map((p) => p.v)}
        positive={row.original.changePercent >= 0}
      />
    ),
  },
  {
    id: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => (
      <MetricCell
        value={formatCompactCurrency(row.original.marketCap)}
        changePercent={row.original.changePercent}
      />
    ),
  },
  {
    id: "liquidity",
    header: "Liquidity",
    cell: ({ row }) => (
      <MetricCell value={formatCompactCurrency(row.original.liquidity)} />
    ),
  },
  {
    id: "volume",
    header: "Volume",
    cell: ({ row }) => (
      <MetricCell value={formatCompactCurrency(row.original.volume)} />
    ),
  },
  {
    id: "txns",
    header: "TXNS",
    cell: ({ row }) => (
      <TxnsCell
        total={row.original.txnsTotal}
        buys={row.original.txnsBuys}
        sells={row.original.txnsSells}
      />
    ),
  },
  {
    id: "tokenInfo",
    header: "Token Info",
    cell: ({ row }) => <TokenSecurityBadges metrics={row.original.metrics} />,
  },
  {
    id: "action",
    header: () => <span className="sr-only">Action</span>,
    cell: () => <ActionButtons />,
  },
];

/* ------------------------------------------------------------------ */
/* Table shell                                                          */
/* ------------------------------------------------------------------ */

export function TrendingTable({ className }: { className?: string }) {
  const localQuery = useTrendingPairs();
  const tableData = localQuery.data ?? [];
  const tableLoading = localQuery.isLoading ?? false;

  const table = useReactTable({
    data: tableData,
    columns: trendingColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[1400px] border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-border border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap px-4 py-3 text-left font-medium text-white/40 text-xs"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {tableLoading &&
            arrayWithId(6).map(({ id }) => (
              <tr key={id} className="border-border/60 border-b">
                <td colSpan={trendingColumns.length} className="px-4 py-4">
                  <div className="h-11 w-full animate-pulse rounded-md bg-white/3" />
                </td>
              </tr>
            ))}

          {!tableLoading &&
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-border/60 border-b transition-colors hover:bg-white/[0.02]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-4 py-4 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

          {!tableLoading && tableData.length === 0 && (
            <tr>
              <td
                colSpan={trendingColumns.length}
                className="px-4 py-12 text-center text-sm text-white/30"
              >
                No pairs match this filter yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
