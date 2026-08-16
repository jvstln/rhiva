"use client";

// import { ChartContainer } from "@/components/ui/chart";
// import { Area, AreaChart } from "recharts";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { TokenDetail } from "@rhivadotfun/dataapi";

import { Button } from "@/components/ui/button";
import { useMarketStore } from "../market.store";
import { InfoBadge } from "@/components/ui/info-badge";
import { DexPaid, TotalFees } from "./tooltips/DexInfo";
import { QueryState } from "@/components/layout/QueryState";
import { CashbackNotice, DevHoldOrDevSell } from "./tooltips/DevInfo";
import { useTrendingTokens, useWatchlistTokens } from "../market.hook";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
} from "@/lib/utils";
import {
  BundlersHold,
  InsidersHold,
  PhishingsHold,
  SnipersHold,
  TopHolders,
} from "./tooltips/Holders";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
  TokenSymbolCopy,
} from "./tooltips/TokenAvatar";
import {
  TokenConnection,
  TokenLatestPost,
  TokenSocialSearch,
  TokenViewCount,
  TokenWebsite,
} from "./tooltips/Socials";
import { BuyAndSellButton } from "./BuyAndSellButton";

export function AddTokenToWatchlistButton({ mint }: { mint: string }) {
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

function PairInfoCell({ token }: { token: TokenDetail }) {
  const _updatedAt = token.live?.updated_at
    ? new Date(Number(token.live.updated_at))
    : new Date();
  return (
    <div
      data-token-id={token.mint}
      className="flex items-center gap-3"
    >
      <AddTokenToWatchlistButton mint={token.mint} />
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
            {formatAge(token.live?.updated_at)}
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
      <InfoBadge
        className={cn(
          "text-xs",
          changePercent && changePercent >= 0
            ? "[--accent:var(--color-up)]"
            : "[--accent:var(--color-down)]",
        )}
      >
        {`${formatCompactNumber(changePercent, { withSign: true })}%`}
      </InfoBadge>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Token security badge grid                                           */
/* ------------------------------------------------------------------ */

type TokenMetric = (props: { token: TokenDetail }) => React.JSX.Element;
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

function ActionButtons({ token }: { token: TokenDetail }) {
  const quickBuy = useMarketStore((state) => state.trendingFilters.quickBuy);
  const quickSell = useMarketStore((state) => state.trendingFilters.quickSell);

  return (
    <div className="flex items-center justify-start gap-2">
      <BuyAndSellButton
        type="buy"
        token={token}
        value={quickBuy}
      />
      <BuyAndSellButton
        type="sell"
        token={token}
        value={quickSell}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column definitions                                                   */
/* ------------------------------------------------------------------ */

export function TrendingTable({ tokens }: { tokens: TokenDetail[] }) {
  const router = useRouter();
  const timeframe = useMarketStore((state) => state.trendingFilters.timeframe);

  const columns = useMemo<ColumnDef<TokenDetail>[]>(() => {
    return [
      {
        id: "pairInfo",
        header: "Pair Info",
        cell: ({ row }) => <PairInfoCell token={row.original} />,
        size: 400,
      },
      {
        id: "marketCap",
        header: "Market Cap",
        cell: ({ row }) => {
          const mcap = row.original.market_cap_usd;
          const pct =
            row.original.timeframes?.windows?.[timeframe]?.price_change_pct;
          return (
            <MetricCell
              value={formatCompactCurrency(mcap)}
              changePercent={pct ?? undefined}
            />
          );
        },
      },
      {
        id: "liquidity",
        header: "Liquidity",
        cell: ({ row }) => {
          return (
            <span className="font-medium text-sm">
              {formatCompactCurrency(row.original.liquidity_usd)}
            </span>
          );
        },
      },
      {
        id: "volume",
        header: "Volume",
        cell: ({ row }) => {
          const vol = row.original.timeframes?.windows?.[timeframe]?.volume_usd;
          return (
            <span className="font-medium text-sm">
              {formatCompactCurrency(vol)}
            </span>
          );
        },
      },
      {
        id: "txns",
        header: "TXNS",
        cell: ({ row }) => {
          const window = row.original.timeframes?.windows?.[timeframe];
          const buys = window?.buys !== undefined ? Number(window.buys) : null;
          const sells = window?.sells ?? null;
          const totalTransaction =
            buys !== null && sells !== null ? buys + sells : null;

          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-foreground text-sm">
                {formatCompactNumber(totalTransaction)}
              </span>
              <span className="font-medium **:data-[slot=info-badge]:text-xs">
                <InfoBadge className="[--accent:var(--color-up)]">
                  {formatCompactNumber(buys)}
                </InfoBadge>{" "}
                /{" "}
                <InfoBadge className="[--accent:var(--color-down)]">
                  {formatCompactNumber(sells)}
                </InfoBadge>
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
        size: 220,
      },
      {
        id: "action",
        header: () => <span className="">Action</span>,
        cell: ({ row }) => <ActionButtons token={row.original} />,
        size: 130,
      },
    ];
  }, [timeframe]);

  const table = useDataTable({
    data: tokens,
    columns,
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
        key={tokens[0]?.mint}
        table={table}
        classNames={{
          table: "size-full table-fixed",
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
      <TrendingTable tokens={trendingTokens.data ?? []} />
    </QueryState>
  );
}

export function WatchlistView() {
  const watchlistTokens = useWatchlistTokens();

  return (
    <QueryState query={watchlistTokens}>
      {(query) => <TrendingTable tokens={query.data ?? []} />}
    </QueryState>
  );
}
