"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
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
import { useTrendingTokens, useWatchlistTokens } from "../market.hook";
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
  TokenSymbolCopy,
} from "./tooltips/TokenAvatar";
import { useRouter } from "next/navigation";
import { CashbackNotice, DevHoldOrDevSell } from "./tooltips/DevInfo";
import {
  BundlersHold,
  InsidersHold,
  PhishingsHold,
  SnipersHold,
  TopHolders,
} from "./tooltips/Holders";
import { DexPaid, TotalFees } from "./tooltips/DexInfo";
import { formatDistanceToNowStrict } from "date-fns";
// import { ChartContainer } from "@/components/ui/chart";
// import { Area, AreaChart } from "recharts";

export function AddToWatchlistButton({ mint }: { mint: string }) {
  const toggleWatchlist = useMarketStore((state) => state.watchlist.toggle);
  const watchlist = useMarketStore((state) => state.watchlist.items);

  const isInWatchlist = watchlist.includes(mint);

  return (
    <Button
      variant="ghost"
      size="icon"
      tooltip={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      aria-pressed={isInWatchlist}
      data-pressed={isInWatchlist || undefined}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleWatchlist(mint);
      }}
    >
      <Star className="text-amber-500 group-data-pressed/button:fill-current" />
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Mini chart                                                         */
/* ------------------------------------------------------------------ */

// function TokenMiniChart({ data }: { data: number[] }) {
//   const chartData = useMemo(() => {
//     return data.map((value, i) => ({
//       x: String(i),
//       y: String(value),
//     }));
//   }, [data]);

//   return (
//     <div className="h-20 w-24">
//       <ChartContainer config={{}}>
//         <AreaChart accessibilityLayer data={chartData}>
//           <Area
//             dataKey="y"
//             type="natural"
//             fill="var(--color-up)"
//             fillOpacity={0.4}
//             stroke="var(--color-up)"
//           />
//         </AreaChart>
//       </ChartContainer>
//     </div>
//   );
// }

/* ------------------------------------------------------------------ */
/* Pair info cell (star, avatar, name, sub-icons, watcher count)       */
/* ------------------------------------------------------------------ */

function PairInfoCell({ token }: { token: Token }) {
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
          <TokenSymbolCopy token={token} />
          <TokenLatestPost token={token} />
          <TokenConnection token={token} />
          <TokenWebsite token={token} />
          <TotalFees token={token} />
          <TokenViewCount token={token} />
        </div>
      </div>

      {/* <TokenMiniChart data={[20, 25, 22, 28, 24, 32, 28, 36, 32, 40]} /> */}
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
        changePercent={row.original.priceChangePct}
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
      console.log("tt", row.original.buys, row.original.sells);

      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground text-sm">
            {formatCompactNumber(row.original.totalTransaction)}
          </span>
          <span className="font-medium text-xs">
            <span className="text-ocean-green">
              {formatCompactNumber(row.original.buys)}
            </span>
            <span className="text-white/30"> / </span>
            <span className="text-roman">
              {formatCompactNumber(row.original.sells)}
            </span>
          </span>
        </div>
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

export function TrendingTable({ tokens }: { tokens: Token[] }) {
  const router = useRouter();

  const table = useDataTable({
    data: tokens,
    columns: trendingColumns,
  });

  const pinnedColumnClassName = cn(
    "data-[column-id=action]:sticky data-[column-id=action]:right-0 data-[column-id=action]:bg-background",
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
      <DataTable
        key={tokens[0]?.timeframe}
        table={table}
        classNames={{
          table: "w-max table-fixed",
          tr: "cursor-pointer",
          td: pinnedColumnClassName,
          th: pinnedColumnClassName,
        }}
      />
    </nav>
  );
}

export function TrendingView() {
  const trendingFilters = useMarketStore((state) => state.trendingFilters);
  const trendingTokens = useTrendingTokens(trendingFilters);

  return (
    <QueryState query={trendingTokens}>
      <TrendingTable tokens={trendingTokens.data?.tokens ?? []} />
    </QueryState>
  );
}

export function WatchlistView() {
  const watchlistTokens = useWatchlistTokens();

  const isPending = watchlistTokens.some((q) => q.isPending);
  const tokens = watchlistTokens
    .map((q) => q.data)
    .filter((t): t is Token => !!t);

  return (
    <QueryState query={{ data: tokens }} getIsLoading={() => isPending}>
      <TrendingTable tokens={tokens} />
    </QueryState>
  );
}
