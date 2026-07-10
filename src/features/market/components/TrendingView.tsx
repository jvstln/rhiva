"use client";

import type { ColumnDef } from "@tanstack/react-table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import {
  cn,
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/utils";
import { getInitials } from "../../../lib/utils";
import { useBirdeyeWS, useTrendingTokens } from "../market.hook";
import type { Token } from "../market.type";

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

function PairInfoCell({ token }: { token: Token }) {
  return (
    <div className="flex items-center gap-3">
      <StarButton pairId={token.address} />

      {/* TODO: extract colors from logo, handle flagged status */}
      <TokenIcon colors={["#27272a", "#3f3f46"]} flagged={false} />
      <Avatar variant="square" size="lg">
        <AvatarImage src={token.logo_uri ?? ""} />
        <AvatarFallback className="shimmer uppercase">
          {getInitials(token.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-white">{token.name}</span>
          <span className="text-sm text-white/40">{token.symbol}</span>
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
            {/* TODO: calculate age */}
            {token.recent_listing_time ? "24h" : "N/A"}
          </span>
          {/* TODO: dev activity */}
          <SubIcon
            icon={UserRound}
            active={false}
            activeClassName="text-dodger-blue"
            label="Dev activity"
          />
          {/* TODO: alerts */}
          <SubIcon
            icon={AlertCircle}
            active={false}
            activeClassName="text-casablanca"
            label="Alerts"
          />
          <SubIcon
            icon={Globe}
            active={!!token.extensions?.website}
            label="Website"
          />
          {/* TODO: notes */}
          <SubIcon icon={Flag} active={false} label="Add note" />
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
          {/* TODO: watcher count */}0
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

export interface TrendingPairMetric {
  id: string;
  label: string;
  value: number;
  tone: "risk" | "safe";
  suffix?: string;
}

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
        "flex h-6 w-max shrink-0 items-center gap-1 rounded-md border bg-transparent px-1.5 font-medium text-[11px] tabular-nums",
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
    <div className="grid w-max grid-cols-4 gap-1.5">
      {metrics.map((metric) => (
        <MetricPill key={metric.id} metric={metric} />
      ))}
      <button
        type="button"
        aria-label="View token security details"
        className="flex h-6 w-full items-center justify-center rounded-md border border-roman/40 text-roman transition-colors hover:bg-roman/10"
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

const trendingColumns: ColumnDef<Token>[] = [
  {
    id: "pairInfo",
    header: "Pair Info",
    cell: ({ row }) => <PairInfoCell token={row.original} />,
  },
  {
    id: "chart",
    header: () => <span className="sr-only">Chart</span>,
    cell: ({ row }) => (
      /* TODO: fetch chart data */
      <Sparkline
        data={[]}
        positive={(row.original.price_change_24h_percent ?? 0) >= 0}
      />
    ),
  },
  {
    id: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => (
      <MetricCell
        value={formatCompactCurrency(row.original.market_cap)}
        changePercent={row.original.price_change_24h_percent ?? undefined}
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
      <MetricCell value={formatCompactCurrency(row.original.volume_24h_usd)} />
    ),
  },
  {
    id: "txns",
    header: "TXNS",
    cell: ({ row }) => (
      <TxnsCell
        total={row.original.trade_24h_count}
        buys={row.original.buy_24h}
        sells={row.original.sell_24h}
      />
    ),
  },
  {
    id: "tokenInfo",
    header: "Token Info",
    /* TODO: compute metrics */
    cell: ({ row }) => <TokenSecurityBadges metrics={[]} />,
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

export function TrendingTable() {
  // const ws = useBirdeyeWS("token-stats");
  const trendingTokens = useTrendingTokens();
  console.log(trendingTokens);

  const table = useDataTable({
    data: trendingTokens.data?.items ?? [],
    columns: trendingColumns,
  });

  return (
    <DataTable
      table={table}
      isLoading={trendingTokens.isLoading}
      error={trendingTokens.error?.message}
    />
  );
}
