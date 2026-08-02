"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLiquidityPools } from "../liquidity.hook";
import { gsap } from "@/lib/gsap.util";
import {
  cn,
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/utils";
import { POOL_DEXES, type PoolDex } from "../liquidity.schema";
import { useLiquidityStore } from "../liquidity.store";
import type { PoolWithTokens } from "../liquidity.type";
import { useRouter } from "next/navigation";
import { QueryState } from "@/components/layout/QueryState";
import {
  LiquidityAddressCopy,
  LiquidityAvatar,
} from "./tooltips/LiquidityAvatar";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

function ValueChangeCell({
  value,
  change,
  valueKind = "number",
}: {
  value: number | string | null | undefined;
  change: number | string | null | undefined;
  valueKind?: "currency" | "percent" | "number";
}) {
  const displayValue =
    value === null || value === undefined
      ? "N/A"
      : valueKind === "currency"
        ? formatCompactCurrency(value)
        : valueKind === "percent"
          ? formatSignedPercent(Number(value))
          : typeof value === "number"
            ? value.toLocaleString("en-US")
            : value;
  const displayChange =
    change === null || change === undefined
      ? "N/A"
      : typeof change === "number"
        ? formatSignedPercent(change)
        : change;
  const isDown =
    typeof displayChange === "string" && displayChange.trim().startsWith("-");

  return (
    <div data-slot="value-change-cell">
      <p className="font-medium text-b-3 text-white">{displayValue}</p>
      <p className={cn("text-b-5", isDown ? "text-down" : "text-up")}>
        {displayChange}
      </p>
    </div>
  );
}

export function AddLiquidityToWatchlistButton({
  address,
}: {
  address?: string;
}) {
  const toggleWatchlist = useLiquidityStore((state) => state.watchlist.toggle);
  const watchlist = useLiquidityStore((state) => state.watchlist.items);

  const isInWatchlist = watchlist.includes(address ?? "");

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
        if (!address) return;
        toggleWatchlist(address);
      }}
    >
      <Star className="text-amber-500 group-data-pressed/button:fill-current" />
    </Button>
  );
}

function ZapInButton() {
  const zapIn = useLiquidityStore((state) => state.liquidityFilters.zapIn);

  return (
    <Button
      aria-label="Zap in"
      variant={"secondary"}
      onMouseEnter={(e) => {
        gsap.context(() => {
          gsap.to("[data-slot='action-value']", {
            keyframes: [{ width: "auto" }, { scale: 1 }],
            duration: 0.3,
            ease: "none",
          });
        }, e.currentTarget);
      }}
      onMouseLeave={(e) => {
        gsap.context(() => {
          gsap.to("[data-slot='action-value']", {
            scale: 0,
            width: 0,
            duration: 0.3,
          });
        }, e.currentTarget);
      }}
    >
      <Rocket className="size-4 text-primary" />
      {zapIn !== null && (
        <span
          data-slot="action-value"
          className="w-0 scale-0 overflow-hidden transition-[width]"
        >
          {zapIn} SOL
        </span>
      )}
    </Button>
  );
}

function DexSelector() {
  const dex = useLiquidityStore((s) => s.liquidityFilters.dex);
  const setFilters = useLiquidityStore((s) => s.setLiquidityFilters);

  return (
    <ToggleGroup
      value={[dex ?? "all"]}
      onValueChange={([value]) =>
        setFilters({ dex: value === "all" ? null : (value as PoolDex) })
      }
    >
      <ToggleGroupItem value="all">All pools</ToggleGroupItem>
      {Object.entries(POOL_DEXES).map(([key, pool]) => (
        <ToggleGroupItem
          key={key}
          value={key}
        >
          <pool.icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const columnHelper = createColumnHelper<PoolWithTokens>();

const columns: ColumnDef<PoolWithTokens>[] = [
  columnHelper.display({
    id: "dexSelector",
    header: () => <DexSelector />,
    cell: ({ row }) => {
      const { token_a, token_b, token_mint_a, token_mint_b } = row.original;
      const symbolA = token_a?.symbol ?? token_mint_a.slice(0, 6);
      const symbolB = token_b?.symbol ?? token_mint_b.slice(0, 6);

      return (
        <div
          className="flex items-center gap-2"
          data-pool-id={row.original.pool_address}
        >
          <AddLiquidityToWatchlistButton address={row.original.pool_address} />

          <div className="flex items-center gap-3">
            <LiquidityAvatar liquidity={row.original} />

            <div>
              <p className="flex gap-1 font-semibold text-b-2 text-white">
                <Link
                  href={`/token/${token_mint_a}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {symbolA}
                </Link>{" "}
                /{" "}
                <Link
                  href={`/token/${token_mint_b}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {symbolB}
                </Link>
                <LiquidityAddressCopy liquidity={row.original} />
              </p>
              <p className="text-muted-foreground text-xs">
                Tick Spacing: {row.original.tick_spacing} Fee:{" "}
                {row.original.total_fee_pct}%
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDistanceToNowStrict(row.original.age_seconds).replace(
                  /^.*?(\d+)\s*(\w).*$/,
                  "$1$2",
                )}
              </p>
            </div>
          </div>
        </div>
      );
    },
    size: 270,
  }),
  {
    id: "marketCap",
    accessorKey: "market_cap_usd",
    header: "Market Cap",
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.market_cap_usd}
        change={row.original.token_a?.market_cap_change_24h_pct}
        valueKind="currency"
      />
    ),
    size: 100,
  },
  {
    id: "tvl",
    accessorKey: "tvl_usd",
    header: "TVL",
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.tvl_usd}
        change={null}
        valueKind="currency"
      />
    ),
    size: 100,
  },
  columnHelper.display({
    id: "activeTvl",
    header: "Active TVL",
    cell: () => (
      <ValueChangeCell
        value={null}
        change={null}
        valueKind="currency"
      />
    ),
    size: 100,
  }),
  columnHelper.display({
    id: "fees",
    header: "Fees",
    cell: () => (
      <ValueChangeCell
        value={null}
        change={null}
        valueKind="currency"
      />
    ),
    size: 100,
  }),
  columnHelper.display({
    id: "feesRatio",
    header: "Fees/Active TVL",
    cell: () => (
      <ValueChangeCell
        value={null}
        change={null}
        valueKind="percent"
      />
    ),
    size: 100,
  }),
  {
    id: "volume",
    accessorKey: "volume_24h_usd",
    header: "Vol",
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.volume_24h_usd}
        change={row.original.volume_change_pct}
        valueKind="currency"
      />
    ),
    size: 100,
  },
  columnHelper.display({
    id: "volumeRatio",
    header: "Vol/Active TVL",
    cell: () => (
      <ValueChangeCell
        value={null}
        change={null}
        valueKind="percent"
      />
    ),
    size: 100,
  }),
  columnHelper.display({
    id: "more",
    cell({ row }) {
      const pool = row.original;
      return (
        <Popover>
          <PopoverTrigger
            openOnHover
            render={
              <Button
                size="sm"
                variant="outline"
              />
            }
          >
            More
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="p-0"
          >
            <div className="flex flex-col py-1">
              {[
                {
                  label: "Swap",
                  value: formatCompactCurrency(pool.swaps_24h),
                  className: "text-emerald-400",
                },
                {
                  label: "Traders",
                  value: formatCompactNumber(Number(pool.traders_24h)),
                  className: "text-emerald-400",
                },
                {
                  label: "Total LPs",
                  value: formatCompactNumber(pool.total_lps),
                  className: "text-emerald-400",
                },
                {
                  label: "Net deposit",
                  value: formatCompactCurrency(null),
                  className: "text-white",
                },
                {
                  label: "Holders",
                  value: formatCompactNumber(pool.holders_count),
                  className: "text-emerald-400",
                },
                {
                  label: "Avg Vol/",
                  value: formatCompactCurrency(pool.avg_volume_usd),
                  className: "text-white",
                },
                {
                  label: "Min Volatility",
                  value: formatSignedPercent(null),
                  className: "text-white",
                },
                {
                  label: "Top 10 Holders",
                  value: formatSignedPercent(pool.top10_holder_pct),
                  className: "text-orange-500",
                },
                {
                  label: "Dev Balance",
                  value: formatSignedPercent(pool.dev_balance_pct),
                  className: "text-cyan-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between not-last:border-b px-4 py-1"
                >
                  <span className="text-muted-foreground text-sm">
                    {stat.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`font-medium text-sm ${stat.className}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
    size: 50,
  }),
  {
    id: "action",
    header: "Zap In",
    cell: () => (
      <div className="flex w-24 items-center justify-center gap-4">
        <ZapInButton />
      </div>
    ),
    enableSorting: false,
  },
];

export function PoolsTable() {
  const router = useRouter();
  const filters = useLiquidityStore((s) => s.liquidityFilters);
  const pools = useLiquidityPools(filters);

  const table = useDataTable({
    data: pools.data ?? [],
    columns,
  });

  const pinnedColumnClassName = cn(
    "bg-background data-[column-id=action]:sticky data-[column-id=action]:right-0 data-[column-id=action]:shadow-[inset_1px_0_var(--color-border)]",
    "w-auto!",
  );

  return (
    <nav
      onClick={(e) => {
        if (!(e.target instanceof HTMLElement)) return;

        const poolId = e.target
          .closest("tr:has([data-pool-id])")
          ?.querySelector<HTMLElement>("[data-pool-id]")?.dataset.poolId;

        if (poolId) router.push(`/liquidity/pool/${poolId}`);
      }}
      onKeyDown={() => null}
    >
      <QueryState query={pools}>
        <DataTable
          table={table}
          classNames={{
            table: "w-full",
            th: cn("normal-case", pinnedColumnClassName),
            td: cn(
              "has-data-[slot=value-change-cell]:text-center",
              pinnedColumnClassName,
            ),
            tr: "cursor-pointer",
          }}
        />
      </QueryState>
    </nav>
  );
}
