"use client";

import {
  type ColumnDef,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { Rocket, Star } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MeteoraIcon, OrcaIcon, RaydiumIcon } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLiquidityPools } from "../liquidity.hook";
import { gsap } from "@/lib/gsap.util";
import { cn, getInitials, formatCompactCurrency } from "@/lib/utils";
import { POOLS, type PoolDex } from "../liquidity.schema";
import { useLiquidityStore } from "../liquidity.store";
import type { LiquidityPool } from "../liquidity.type";
import { useRouter } from "next/navigation";

const formatPercentString = (value?: string | number | null): string => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `${num.toLocaleString("en-US", { maximumFractionDigits: 3 })}%`;
};

function ValueChangeCell({ value, change }: { value: string; change: string }) {
  const isDown = change.trim().startsWith("-");
  return (
    <div data-slot="value-change-cell">
      <p className="font-medium text-b-3 text-white">{value}</p>
      <p className={cn("text-b-5", isDown ? "text-down" : "text-up")}>
        {change}
      </p>
    </div>
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

const columnHelper = createColumnHelper<LiquidityPool>();

export function PoolsTable() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pool, setPool] = React.useState<PoolDex | "all">("all");

  const pools = useLiquidityPools();

  const poolStats = React.useMemo(() => {
    const poolsArr = pools.data?.pools ?? [];
    const swapVolume = poolsArr.reduce(
      (sum, pool) => sum + (pool.volume_24h_usd ?? 0),
      0,
    );
    const totalLpCount = poolsArr.reduce(
      (sum, pool) => sum + (pool.total_lps ?? 0),
      0,
    );
    const tradersCount = poolsArr.reduce(
      (sum, pool) => sum + (pool.traders_24h ?? 0),
      0,
    );
    const netDeposit = poolsArr.reduce(
      (sum, pool) => sum + (pool.net_deposit_usd ?? 0),
      0,
    );
    const holdersCount = poolsArr.reduce(
      (sum, pool) => sum + (pool.holders_count ?? 0),
      0,
    );
    const avgVolume = poolsArr.length > 0 ? swapVolume / poolsArr.length : null;
    const minVolatility = poolsArr.reduce<number | null>((current, pool) => {
      const value = pool.min_volatility_pct;
      if (value === undefined || value === null) return current;
      if (current === null) return value;
      return Math.min(current, value);
    }, null);
    const top10Holders = poolsArr.reduce<number | null>((current, pool) => {
      const value = pool.top10_holder_pct;
      if (value === undefined || value === null) return current;
      if (current === null) return value;
      return current + value;
    }, null);
    const devBalance = poolsArr.reduce<number | null>((current, pool) => {
      const value = pool.dev_balance_pct;
      if (value === undefined || value === null) return current;
      if (current === null) return value;
      return current + value;
    }, null);

    return {
      swap: swapVolume,
      traders: tradersCount > 0 ? tradersCount : null,
      totalLps: totalLpCount > 0 ? totalLpCount : null,
      netDeposit: netDeposit > 0 ? netDeposit : null,
      holders: holdersCount > 0 ? holdersCount : null,
      avgVolume,
      minVolatility,
      top10Holders,
      devBalance,
    };
  }, [pools.data]);

  const stats = React.useMemo(
    () => [
      {
        label: "Swap",
        value: poolStats.swap ? formatCompactCurrency(poolStats.swap) : "N/A",
        change: null,
        color: "text-emerald-400",
      },
      {
        label: "Traders",
        value: poolStats.traders?.toString() ?? "N/A",
        change: null,
        color: "text-emerald-400",
      },
      {
        label: "Total LPs",
        value: poolStats.totalLps?.toString() ?? "N/A",
        change: null,
        color: "text-emerald-400",
      },
      {
        label: "Net deposit",
        value: poolStats.netDeposit
          ? formatCompactCurrency(poolStats.netDeposit)
          : "N/A",
        change: null,
        color: "text-white",
      },
      {
        label: "Holders",
        value: poolStats.holders?.toString() ?? "N/A",
        change: null,
        color: "text-emerald-400",
      },
      {
        label: "Avg Vol/",
        value: poolStats.avgVolume
          ? formatCompactCurrency(poolStats.avgVolume)
          : "N/A",
        change: null,
        color: "text-white",
      },
      {
        label: "Min Volatility",
        value:
          poolStats.minVolatility != null
            ? formatPercentString(poolStats.minVolatility)
            : "N/A",
        change: null,
        color: "text-white",
      },
      {
        label: "Top 10 Holders",
        value:
          poolStats.top10Holders != null
            ? formatPercentString(poolStats.top10Holders)
            : "N/A",
        change: null,
        color: "text-orange-500",
      },
      {
        label: "Dev Balance",
        value:
          poolStats.devBalance != null
            ? formatPercentString(poolStats.devBalance)
            : "N/A",
        change: null,
        color: "text-cyan-400",
      },
    ],
    [poolStats],
  );

  const columns = React.useMemo<ColumnDef<LiquidityPool>[]>(
    () => [
      {
        id: "pool",
        header: () => {
          return (
            <ToggleGroup
              defaultValue={[pool]}
              onValueChange={([value]) => setPool(value as PoolDex)}
            >
              <ToggleGroupItem value="all">All pools</ToggleGroupItem>
              {POOLS.map((pool) => (
                <ToggleGroupItem
                  key={pool.id}
                  value={pool.id}
                >
                  <pool.icon />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          );
        },
        cell: ({ row }) => {
          const poolRow = row.original;
          const currentDex =
            pool === "all"
              ? (["meteora", "orca", "raydium"] as const)[row.index % 3]
              : pool;
          const Icon =
            currentDex === "orca"
              ? OrcaIcon
              : currentDex === "raydium"
                ? RaydiumIcon
                : MeteoraIcon;

          return (
            <div
              className="flex items-center gap-2"
              data-pool-id={poolRow.pool_address}
            >
              <Button
                size="icon-sm"
                variant={"ghost"}
                aria-label="Add to watchlist"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Star />
              </Button>

              <div className="flex items-center gap-3">
                <Avatar className="size-9 ring-2 ring-background">
                  <AvatarImage
                    src={`https://picsum.photos/seed/${poolRow.pair}/200`}
                  />
                  <AvatarFallback className="shimmer text-xs">
                    {getInitials(poolRow.pair)}
                  </AvatarFallback>
                  <Icon className="absolute right-0 bottom-0" />
                </Avatar>
                <div>
                  <p className="font-semibold text-b-2 text-white">
                    {poolRow.pair}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Tick Spacing: {poolRow.tickSpacing} Fee: {poolRow.fee}
                  </p>
                  <p className="text-muted-foreground text-xs">{poolRow.age}</p>
                </div>
              </div>
            </div>
          );
        },
        size: 270,
      },
      {
        id: "marketCap",
        accessorKey: "marketCap",
        header: "Market Cap",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.marketCap}
            change={row.original.marketCapChange}
          />
        ),
        size: 100,
      },
      {
        id: "tvl",
        accessorKey: "tvl",
        header: "TVL",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.tvl}
            change={row.original.tvlChange}
          />
        ),
        size: 100,
      },
      {
        id: "activeTvl",
        accessorKey: "activeTvl",
        header: "Active TVL",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.activeTvl}
            change={row.original.activeTvlChange}
          />
        ),
        size: 100,
      },
      {
        id: "fees",
        accessorKey: "fees",
        header: "Fees",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.fees}
            change={row.original.feesChange}
          />
        ),

        size: 100,
      },
      {
        id: "feesRatio",
        accessorKey: "feesRatio",
        header: "Fees/Active TVL",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.feesRatio}
            change={row.original.feesRatioChange}
          />
        ),

        size: 100,
      },
      {
        accessorKey: "volume",
        header: "Vol",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.volume}
            change={row.original.volumeChange}
          />
        ),

        size: 100,
      },
      {
        accessorKey: "volumeRatio",
        header: "Vol/Active TVL",
        cell: ({ row }) => (
          <ValueChangeCell
            value={row.original.volumeRatio}
            change={row.original.volumeRatioChange}
          />
        ),

        size: 100,
      },
      columnHelper.display({
        id: "more",
        cell() {
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
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between not-last:border-b px-4 py-1"
                    >
                      <span className="text-muted-foreground text-sm">
                        {stat.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className={`font-medium text-sm ${stat.color}`}>
                          {stat.value}
                        </div>
                        {stat.change && (
                          <div className="w-12 text-right text-emerald-400 text-xs">
                            {stat.change}
                          </div>
                        )}
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
    ],
    [pool, stats],
  );

  const poolRows = React.useMemo(() => pools.data?.pools ?? [], [pools.data]);

  const table = useDataTable({
    data: poolRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
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

        if (poolId) {
          const route = `/liquidity/pool/${poolId}` as Parameters<
            typeof router.push
          >[0];

          router.push(route);
        }
      }}
      onKeyDown={() => null}
    >
      <DataTable
        table={table}
        classNames={{
          table: "w-full",
          th: cn("normal-case", pinnedColumnClassName),
          td: cn(
            "has-data-[slot=value-change-cell]:text-center",
            pinnedColumnClassName,
          ),
        }}
      />
    </nav>
  );
}
