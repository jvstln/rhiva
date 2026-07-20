"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  BarChart3,
  Bot,
  Copy,
  Crown,
  Eye,
  Fish,
  Flag,
  Globe,
  Layers,
  Leaf,
  type LucideIcon,
  Microscope,
  Search,
  Shield,
  Star,
  Target,
} from "lucide-react";
import { type MouseEventHandler, useMemo } from "react";
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
import type { Timeframe } from "../market.schema";
import { useMarketStore } from "../market.store";
import type { Token } from "../market.type";
import { SocialHoverTooltip } from "./tooltips/SocialHoverTooltip";
import { TokenAvatar, TokenNameAndSymbol } from "./tooltips/TokenAvatar";
import { useRouter } from "next/navigation";

interface TrendingTableMeta {
  timeframe: Timeframe;
}

function AddToWatchlistButton({ mint }: { mint: string }) {
  const toggleWatchlist = useMarketStore((state) => state.watchlist.toggle);
  const watchlist = useMarketStore((state) => state.watchlist.items);

  const isInWatchlist = watchlist.includes(mint);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      aria-pressed={isInWatchlist}
      data-pressed={isInWatchlist || undefined}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleWatchlist(mint);
      }}
    >
      <Star className="text-amber-500 data-pressed:fill-current" />
    </Button>
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
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity={1}
          />
          <stop
            offset="100%"
            stopColor={color}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pair info cell (star, avatar, name, sub-icons, watcher count)       */
/* ------------------------------------------------------------------ */

function PairInfoCell({ token }: { token: Token }) {
  return (
    <div
      data-token-id={token.mint}
      className="flex items-center gap-3"
    >
      <AddToWatchlistButton mint={token.mint} />
      <TokenAvatar token={token} />

      <div className="flex w-[200px] flex-col gap-1">
        <TokenNameAndSymbol token={token} />

        <div className="flex items-center gap-2 *:data-[slot=info-badge]:[&_svg]:size-4">
          <InfoBadge className="text-sm [--accent:var(--color-up)]">
            {token.live?.updated_at ? formatAge(token.live?.updated_at) : "N/A"}
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
                value={token.social?.twitter_url ?? "N/A"}
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
                  token.social?.website_url ? (
                    <a
                      href={token.social?.website_url}
                      target="_blank"
                      rel="noopener"
                    >
                      {token.social?.website_url}
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
            tooltip={token?.description}
            aria-label="Add note"
          >
            <Flag />
          </InfoBadge>
          <InfoBadge aria-label="Inspect pair">
            <Search />
          </InfoBadge>
          <InfoBadge aria-label="Holders">
            <Eye className="size-3" />
            {formatCompactNumber(token.holders?.holder_count)}
          </InfoBadge>
        </div>
      </div>

      <Sparkline
        data={[20, 25, 22, 28, 24, 32, 28, 36, 32, 40]}
        positive={(token.price_change_percent ?? 0) >= 0}
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

export interface TokenMetric {
  id: string;
  label: string;
  value: (token: Token) => string | number | undefined;
  tone: "risk" | "safe";
  suffix?: string;
  icon?: LucideIcon;
}

const METRICS: TokenMetric[] = [
  {
    id: "top10",
    label: "Top 10 Holders",
    value: (token) => formatCompactNumber(token.holders?.top10_holder_pct),
    tone: "risk",
    icon: Crown,
  },
  {
    id: "dev",
    label: "Dev Holdings",
    value: (token) => formatCompactNumber(token.holders?.dev_holder_pct),
    tone: "safe",
    icon: Shield,
  },
  {
    id: "audit",
    label: "Audit Score",
    value: (token) => formatCompactNumber(token.audit_score),
    tone: "safe",
    icon: Microscope,
  },
  {
    id: "bundlers",
    label: "Bundled Supply",
    value: (token) => formatCompactNumber(token.bundled_supply),
    tone: "risk",
    icon: Layers,
  },
  {
    id: "whales",
    label: "Whale Holdings",
    value: (token) => formatCompactNumber(token.whale_holdings),
    tone: "risk",
    icon: Fish,
  },
  {
    id: "snipers",
    label: "Sniper Holdings",
    value: (token) => formatCompactNumber(token.sniper_holdings),
    tone: "safe",
    icon: Target,
  },
  {
    id: "dex",
    label: "DEX Screener",
    value: (token) => token.live?.has_paid_order,
    tone: "safe",
    icon: BarChart3,
  },
  {
    id: "bot",
    label: "Bot Activity",
    value: (token) => token.bot_activity,
    tone: "safe",
    icon: Bot,
  },
];

function TokenSecurityBadges({ token }: { token: Token }) {
  return (
    <div className="flex flex-wrap gap-1">
      {METRICS.map((metric) => {
        const Icon = metric.icon;
        const tone = metric.tone === "risk" ? "down" : "up";
        const metricValue = metric.value(token) ?? "N/A";

        return (
          <InfoBadge
            key={metric.id}
            variant="badge"
            tone={tone}
            tooltip={
              <InfoBadgeTooltipRow
                label={metric.label}
                value={metricValue}
              />
            }
          >
            {Icon && <Icon />}
            {metricValue}
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
        <Button
          variant="sell"
          size="sm"
        >
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

const trendingColumns: ColumnDef<Token>[] = [
  {
    id: "pairInfo",
    header: "Pair Info",
    cell: ({ row }) => <PairInfoCell token={row.original} />,
    size: 500,
  },
  {
    id: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => (
      <MetricCell
        value={formatCompactCurrency(
          row.original.live?.dexscreener_market_cap_usd,
        )}
        changePercent={row.original.price_change_percent}
      />
    ),
  },
  {
    id: "liquidity",
    header: "Liquidity",
    cell: ({ row }) => (
      <MetricCell
        value={formatCompactCurrency(
          row.original.live?.dexscreener_liquidity_usd,
        )}
      />
    ),
  },
  {
    id: "volume",
    header: "Volume",
    cell: ({ row, table }) => {
      const { timeframe } = table.options.meta as TrendingTableMeta;
      const volumeUsd = row.original.timeframes?.[timeframe]?.volume_usd ?? 0;
      return <MetricCell value={formatCompactCurrency(volumeUsd)} />;
    },
  },
  {
    id: "txns",
    header: "TXNS",
    cell: ({ row, table }) => {
      const { timeframe } = table.options.meta as TrendingTableMeta;
      const trades = row.original.timeframes?.[timeframe]?.trade_count ?? 0;
      const buys = row.original.timeframes?.[timeframe]?.buy ?? 0;
      const sells = row.original.timeframes?.[timeframe]?.sell ?? 0;
      return (
        <TxnsCell
          total={trades}
          buys={buys}
          sells={sells}
        />
      );
    },
  },
  {
    id: "tokenInfo",
    header: "Token Info",
    cell: ({ row }) => <TokenSecurityBadges token={row.original} />,
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
  const router = useRouter();
  const trendingFilters = useMarketStore((state) => state.trendingFilters);
  const trendingTokens = useTrendingTokens(trendingFilters);

  console.log(trendingTokens.data);

  const table = useDataTable({
    data: trendingTokens.data?.tokens ?? [],
    columns: trendingColumns,
    meta: {
      timeframe: trendingFilters.timeframe,
    },
  });

  const pinnedColumnClassName = cn(
    "data-[column-id=action]:sticky data-[column-id=action]:right-0  bg-background",
  );

  return (
    <nav
      // Check for row clicks and redirect to token page if a row is clicked
      onClick={(e) => {
        if (!(e.target instanceof HTMLElement)) return;

        const tokenId = e.target
          .closest("tr:has([data-token-id])")
          ?.querySelector<HTMLElement>("[data-token-id]")?.dataset.tokenId;

        if (tokenId) router.push(`/token/${tokenId}`);
      }}
      onKeyDown={() => null}
      className="mx-auto w-full min-w-0 2xl:container"
    >
      <QueryState query={trendingTokens}>
        <DataTable
          table={table}
          classNames={{
            table: "table-fixed w-max",
            tr: "cursor-pointer",
            td: pinnedColumnClassName,
            th: pinnedColumnClassName,
          }}
        />
      </QueryState>
    </nav>
  );
}
