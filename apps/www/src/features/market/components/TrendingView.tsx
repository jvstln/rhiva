"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, CopyCheck, Star } from "lucide-react";
import { useMemo } from "react";
import { QueryState } from "@/components/layout/QueryState";
import { Button } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import {
  cn,
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/utils";
import { useTrendingTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import type { Token } from "../market.type";
import {
  TokenConnection,
  TokenLatestPost,
  TokenSocialSearch,
  TokenViewCount,
  TokenWebsite,
} from "./tooltips/Socials";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
} from "./tooltips/TokenAvatar";
import { useRouter } from "next/navigation";
import { CashbackNotice, DevHoldOrDevSell } from "./tooltips/DevHoldOrDevSell";
import {
  BundlersHold,
  InsidersHold,
  PhishingsHold,
  SnipersHold,
  TopHolders,
} from "./tooltips/Holders";
import { DexPaid } from "./tooltips/DexInfo";
import { formatDistanceToNowStrict } from "date-fns";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";

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

function TokenMiniChart({ data }: SparklineProps) {
  const chartData = useMemo(() => {
    return data.map((value, i) => ({
      x: String(i),
      y: String(value),
    }));
  }, [data]);

  return (
    <div className="h-20 w-24">
      <ChartContainer config={{}}>
        <AreaChart accessibilityLayer data={chartData}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="y"
            type="natural"
            fill="var(--color-up)"
            fillOpacity={0.4}
            stroke="var(--color-up)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pair info cell (star, avatar, name, sub-icons, watcher count)       */
/* ------------------------------------------------------------------ */

function PairInfoCell({ token }: { token: Token }) {
  const { copy, copyState } = useCopyToClipboard();
  return (
    <div data-token-id={token.mint} className="flex items-center gap-3">
      <AddToWatchlistButton mint={token.mint} />
      <TokenAvatar token={token} />

      <div className="flex w-50 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <TokenNameAndSymbol token={token} />
          <CashbackNotice token={token} />
          <TokenDescription token={token} />
          <TokenSocialSearch token={token} />
        </div>

        <div className="flex items-baseline gap-1">
          <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
            {formatDistanceToNowStrict(token.updatedAt).replace(
              /^.*?(\d+)\s*(\w).*$/,
              "$1$2",
            )}
          </InfoBadge>
          <InfoBadge
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              copy(token.mint);
            }}
            className="text-sm"
          >
            {token.mint.slice(0, 4)}...{token.mint.slice(-4)}{" "}
            {copyState === "copied" ? <CopyCheck /> : <Copy />}
          </InfoBadge>
          <TokenLatestPost token={token} />
          <TokenConnection token={token} />
          <TokenWebsite token={token} />
          <TokenViewCount token={token} />
        </div>
      </div>

      <TokenMiniChart data={[20, 25, 22, 28, 24, 32, 28, 36, 32, 40]} />
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

type TokenMetric = (props: { token: Token }) => React.JSX.Element;
const METRICS: TokenMetric[] = [
  TopHolders,
  DevHoldOrDevSell,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  SnipersHold,
  DexPaid,
];

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
        value={formatCompactCurrency(row.original.marketCapUsd)}
        changePercent={row.original.priceChangePercent}
      />
    ),
  },
  {
    id: "liquidity",
    header: "Liquidity",
    cell: ({ row }) => (
      <MetricCell value={formatCompactCurrency(row.original.liquidityUsd)} />
    ),
  },
  {
    id: "volume",
    header: "Volume",
    cell: ({ row }) => {
      return (
        <MetricCell value={formatCompactCurrency(row.original.volumeUsd)} />
      );
    },
  },
  {
    id: "txns",
    header: "TXNS",
    cell: ({ row }) => {
      return (
        <TxnsCell
          total={row.original.totalTransaction}
          buys={row.original.buys}
          sells={row.original.sells}
        />
      );
    },
  },
  {
    id: "tokenInfo",
    header: "Token Info",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          {METRICS.map((Metric, i) => {
            return (
              <Metric
                // biome-ignore lint/suspicious/noArrayIndexKey: Order never changes
                key={i}
                token={row.original}
              />
            );
          })}
        </div>
      );
    },
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
