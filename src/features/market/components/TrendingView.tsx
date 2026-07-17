"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  Copy,
  Crown,
  Eye,
  Fish,
  Flag,
  Globe,
  Layers,
  Leaf,
  Microscope,
  Rat,
  Search,
  Sprout,
  Star,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { useMemo, useState } from "react";
import { siGoogle } from "simple-icons";
import { QueryState } from "@/components/layout/QueryState";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SimpleIcon } from "@/components/ui/icons";
import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/utils";
import { useTrendingTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import type { TrendingToken } from "../market.type";
import { SocialHoverTooltip } from "./tooltips/SocialHoverTooltip";
import { TokenAvatar } from "./tooltips/TokenAvatar";

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

function PairInfoCell({ token }: { token: TrendingToken }) {
  return (
    <div className="flex items-center gap-3">
      <StarButton pairId={token.address} />

      <TokenAvatar token={token} />

      <div className="flex w-[200px] flex-col gap-1">
        <DropdownMenu>
          <div className="flex items-center gap-1 text-base">
            <span className="truncate font-semibold">{token.name}</span>
            <DropdownMenuTrigger
              render={
                <span className="flex items-center gap-1 text-muted-foreground" />
              }
              openOnHover
              delay={0}
            >
              <span className="truncate">{token.symbol}</span>
              <Copy className="size-3.5" />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent align="center" className="w-fit max-w-[250px]">
            <DropdownMenuItem>
              <Copy />
              Copy
              <span className="truncate">{token.address}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="truncate">
              <Copy /> Copy <span className="truncate">{token.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="truncate">
              <SimpleIcon icon={siGoogle} /> Google for{" "}
              <span className="truncate">{token.name}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 *:data-[slot=info-badge]:[&_svg]:size-4">
          <InfoBadge className="text-sm [--accent:var(--color-up)]">
            {formatAge(token.recent_listing_time)}
          </InfoBadge>
          <InfoBadge
            aria-label="Dev activity"
            tooltip={<SocialHoverTooltip token={token} />}
            className="[--accent:var(--color-info)]"
          >
            <Leaf />
          </InfoBadge>
          <InfoBadge
            aria-label="Alerts"
            className="[--accent:var(--color-warn)]"
            tooltip={
              <InfoBadgeTooltipRow
                label="X Connection"
                value={token.extensions?.twitter ?? "N/A"}
              />
            }
          >
            <AlertCircle />
          </InfoBadge>
          <InfoBadge
            aria-label="Website"
            tooltip={
              <InfoBadgeTooltipRow
                label="Website"
                value={
                  token.extensions?.website ? (
                    <a href={token.extensions?.website} target="_blank">
                      {token.extensions?.website}
                    </a>
                  ) : (
                    "N/A"
                  )
                }
              />
            }
          >
            <Globe />
          </InfoBadge>
          <InfoBadge
            tooltip={token.extensions?.description}
            aria-label="Add note"
          >
            <Flag />
          </InfoBadge>
          <InfoBadge aria-label="Inspect pair">
            <Search />
          </InfoBadge>
          <InfoBadge>
            <Eye className="size-3" />
            {formatCompactNumber(token.holder)}
          </InfoBadge>
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
    <div className="flex flex-col">
      <span className="font-medium text-sm text-white">{value}</span>
      {changePercent !== undefined && (
        <InfoBadge
          className={cn(
            changePercent >= 0
              ? "[--accent:var(--color-up)]"
              : "[--accent:var(--color-down)]",
          )}
        >
          {formatSignedPercent(changePercent)}
        </InfoBadge>
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
      {metrics.map((metric) => {
        const Icon = METRIC_ICONS[metric.id] ?? UserRoundCheck;

        return (
          <InfoBadge
            key={metric.id}
            variant="badge"
            tone={metric.tone === "risk" ? "down" : "up"}
            tooltip={metric.label}
          >
            <Icon />
            {metric.value}%{metric.suffix && <span>{metric.suffix}</span>}
          </InfoBadge>
        );
      })}
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
    <div className="flex items-center justify-start gap-2">
      {quickSell !== null && (
        <Button variant="sell" size="sm">
          <span className={cn(quickSell > 0 && "group-hover/button:hidden")}>
            Sell
          </span>
          {quickSell > 0 && (
            <span className="hidden group-hover/button:inline">
              {quickSell}%
            </span>
          )}
        </Button>
      )}
      {quickBuy !== null && (
        <Button size="sm">
          <span className={cn(quickBuy > 0 && "group-hover/button:hidden")}>
            Buy
          </span>
          {quickBuy > 0 && (
            <span className="hidden group-hover/button:inline">
              {quickBuy} SOL
            </span>
          )}
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
    size: 500,
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
    size: 300,
  },
  {
    id: "action",
    header: () => <span className="">Action</span>,
    cell: () => <ActionButtons />,
    size: 130,
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

  const pinnedColumnClassName = cn(
    "data-[column-id=action]:sticky data-[column-id=action]:right-0  bg-background",
  );

  return (
    <div className="mx-auto w-full min-w-0 2xl:container">
      <QueryState query={trendingTokens}>
        <DataTable
          table={table}
          classNames={{
            table: "table-fixed w-max",
            td: pinnedColumnClassName,
            th: pinnedColumnClassName,
          }}
        />
      </QueryState>
    </div>
  );
}
