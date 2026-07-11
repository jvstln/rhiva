"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  AlertTriangle,
  Copy,
  Crosshair,
  Crown,
  Eye,
  Fish,
  Flag,
  Globe,
  Layers,
  Microscope,
  Rat,
  Search,
  Sprout,
  Star,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/utils";
import { getInitials } from "../../../lib/utils";
import { useTrendingTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import type { TrendingToken } from "../market.type";
import { SocialHoverTooltip } from "./tooltips/SocialHoverTooltip";

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
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pair info cell (star, avatar, name, sub-icons, watcher count)       */
/* ------------------------------------------------------------------ */

// SubIcon logic replaced with InfoBadge variant="icon"

import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import { TokenHoverTooltip } from "./tooltips/TokenHoverTooltip";

function PairInfoCell({ token }: { token: TrendingToken }) {
  return (
    <div className="flex items-center gap-3">
      <StarButton pairId={token.address} />

      <TokenHoverTooltip token={token}>
        <Avatar variant="square" size="lg">
          <AvatarImage src={token.logo_uri ?? ""} />
          <AvatarFallback>{getInitials(token.name)}</AvatarFallback>
        </Avatar>
      </TokenHoverTooltip>

      <div className="mr-auto flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-white">{token.name}</span>
          <span className="text-sm text-white/40">{token.symbol}</span>
          <Button size={"icon-xs"} variant="ghost">
            <Copy />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-medium text-ocean-green text-xs">
            {formatAge(token.recent_listing_time)}
          </span>
          <InfoBadge
            variant="icon"
            icon={UserRound}
            aria-label="Dev activity"
            tooltip={<SocialHoverTooltip token={token} />}
          />
          <InfoBadge
            variant="icon"
            icon={AlertCircle}
            aria-label="Alerts"
            tooltip={
              <InfoBadgeTooltipRow
                label="X Connection"
                value={token.extensions.twitter ?? "N/A"}
              />
            }
          />
          <InfoBadge
            variant="icon"
            icon={Globe}
            aria-label="Website"
            tooltip={
              <InfoBadgeTooltipRow
                label="Website"
                value={
                  token.extensions.website ? (
                    <a href={token.extensions.website} target="_blank">
                      {token.extensions.website}
                    </a>
                  ) : (
                    "N/A"
                  )
                }
              />
            }
          />
          <InfoBadge
            variant="icon"
            icon={Flag}
            tooltip={token.extensions?.description}
            aria-label="Add note"
          />
          <InfoBadge variant="icon" icon={Search} aria-label="Inspect pair" />
        </div>
        <div className="mt-auto flex items-center gap-1 text-[11px] text-white/30">
          <Eye className="size-3" />
          {formatCompactNumber(token.holder)}
        </div>
      </div>

      <Sparkline
        data={[20, 25, 22, 28, 24, 32, 28, 36, 32, 40]}
        positive={(token.price_change_24h_percent ?? 0) >= 0}
      />
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
  airdrop: Rat,
  bundlers: Layers,
  devSold: Microscope,
  freshWallets: Fish,
  lpBurned: Sprout,
};

export interface TrendingPairMetric {
  id: string;
  label: string;
  value: number;
  tone: "risk" | "safe";
  suffix?: string;
}

// MetricPill replaced with InfoBadge variant="badge"

function TokenSecurityBadges({ metrics }: { metrics: TrendingPairMetric[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {metrics.map((metric) => (
        <InfoBadge
          key={metric.id}
          variant="badge"
          tone={metric.tone === "risk" ? "down" : "up"}
          icon={METRIC_ICONS[metric.id] ?? UserRoundCheck}
          label={
            <>
              {metric.value}%
              {metric.suffix && (
                <span className="pl-0.5 text-white/30">{metric.suffix}</span>
              )}
            </>
          }
          tooltip={metric.label}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sell / Buy action buttons                                            */
/* ------------------------------------------------------------------ */

function ActionButtons() {
  const quickBuy = useMarketStore((state) => state.trendingFilters.quickBuy);
  const quickSell = useMarketStore((state) => state.trendingFilters.quickSell);

  return (
    <div className="flex items-center gap-2">
      {quickSell !== null && (
        <Button variant="sell" size="sm">
          Sell {quickSell > 0 ? `(${quickSell}%)` : ""}
        </Button>
      )}
      {quickBuy !== null && (
        <Button variant="default" size="sm">
          Buy {quickBuy > 0 ? `(${quickBuy} SOL)` : ""}
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column definitions                                                   */
/* ------------------------------------------------------------------ */

const MOCK_SECURITY_METRICS: TrendingPairMetric[] = [
  { id: "holders", label: "Holders", value: 99, tone: "risk" },
  { id: "top10", label: "Top 10", value: 99, tone: "risk", suffix: "7d" },
  { id: "airdrop", label: "Snipers", value: 0, tone: "safe" },
  { id: "bundlers", label: "Bundlers", value: 0, tone: "safe" },
  { id: "devSold", label: "Audit", value: 0, tone: "safe" },
  { id: "freshWallets", label: "Whales", value: 0, tone: "safe" },
  { id: "lpBurned", label: "LP Burned", value: 98.71, tone: "risk" },
];

const LinkWrapper = ({
  ...props
}: Partial<React.ComponentProps<typeof Link>>) => (
  <Link {...props} href="/token" className={cn("block", props.className)} />
);

const trendingColumns: ColumnDef<TrendingToken>[] = [
  {
    id: "pairInfo",
    header: "Pair Info",
    cell: ({ row }) => (
      <LinkWrapper>
        <PairInfoCell token={row.original} />
      </LinkWrapper>
    ),
  },
  {
    id: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => (
      <LinkWrapper>
        <MetricCell
          value={formatCompactCurrency(row.original.market_cap)}
          changePercent={row.original.price_change_24h_percent ?? undefined}
        />
      </LinkWrapper>
    ),
  },
  {
    id: "liquidity",
    header: "Liquidity",
    cell: ({ row }) => (
      <LinkWrapper>
        <MetricCell value={formatCompactCurrency(row.original.liquidity)} />
      </LinkWrapper>
    ),
  },
  {
    id: "volume",
    header: "Volume",
    cell: ({ row }) => (
      <LinkWrapper>
        <MetricCell
          value={formatCompactCurrency(row.original.volume_24h_usd)}
        />
      </LinkWrapper>
    ),
  },
  {
    id: "txns",
    header: "TXNS",
    cell: ({ row }) => (
      <LinkWrapper>
        <TxnsCell
          total={row.original.trade_24h_count}
          buys={row.original.buy_24h}
          sells={row.original.sell_24h}
        />
      </LinkWrapper>
    ),
  },
  {
    id: "tokenInfo",
    header: "Token Info",
    /* TODO: replace with real backend metrics when available */
    cell: ({ row }) => (
      <LinkWrapper>
        <TokenSecurityBadges metrics={MOCK_SECURITY_METRICS} />
      </LinkWrapper>
    ),
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
  const trendingFilters = useMarketStore((state) => state.trendingFilters);
  const trendingTokens = useTrendingTokens(trendingFilters);

  const table = useDataTable({
    data: trendingTokens.data?.items ?? [],
    columns: trendingColumns,
  });

  return (
    <DataTable
      table={table}
      isLoading={trendingTokens.isPending}
      error={trendingTokens.error?.message}
    />
  );
}
