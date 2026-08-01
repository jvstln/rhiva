"use client";

import * as React from "react";
import { Rocket, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";

import { gsap } from "@/lib/gsap.util";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLiquidityPools } from "../liquidity.hook";
import { useLiquidityStore } from "../liquidity.store";
import type { LiquidityPool } from "../liquidity.type";
import { POOLS, type PoolDex } from "../liquidity.schema";
import { QueryState } from "@/components/layout/QueryState";
import { MeteoraIcon, OrcaIcon, RaydiumIcon } from "@/components/ui/icons";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    const poolsArr = pools.data ?? [];
    const swapVolume = poolsArr.reduce(
      (sum: number, pool) => sum + (pool.volume_24h_usd ?? 0),
      0,
    );
    const totalLpCount = poolsArr.reduce(
      (sum: number, pool) => sum + Number(pool.total_lps ?? 0),
      0,
    );
    const tradersCount = poolsArr.reduce(
      (sum: number, pool) => sum + Number(pool.traders_24h ?? 0),
      0,
    );
    const netDeposit = poolsArr.reduce(
      (sum: number, pool: any) => sum + (pool.net_deposit_usd ?? 0),
      0,
    );
    const holdersCount = poolsArr.reduce(
      (sum: number, pool) => sum + (pool.holders_count ?? 0),
      0,
    );
    const avgVolume = poolsArr.length > 0 ? swapVolume / poolsArr.length : null;
    const minVolatility = poolsArr.reduce<number | null>(
      (current, pool: any) => {
        const value = pool.min_volatility_pct;
        if (value === undefined || value === null) return current;
        if (current === null) return value;
        return Math.min(current, value);
      },
      null,
    );
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
      top10Holders:
        top10Holders !== null && poolsArr.length > 0
          ? top10Holders / poolsArr.length
          : null,
      devBalance:
        devBalance !== null && poolsArr.length > 0
          ? devBalance / poolsArr.length
          : null,
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
              ? (["meteora-dlmm", "orca", "raydium-clmm"] as const)[
                  row.index % 3
                ]
              : pool;
          const Icon =
            currentDex === "orca"
              ? OrcaIcon
              : currentDex === "raydium-clmm"
                ? RaydiumIcon
                : MeteoraIcon;

          const symbolA =
            poolRow.token_a?.symbol ?? poolRow.token_mint_a.slice(0, 6);
          const symbolB =
            poolRow.token_b?.symbol ?? poolRow.token_mint_b.slice(0, 6);
          const pair = `${symbolA}/${symbolB}`;

          const baseToken =
            poolRow.token_mint_a === poolRow.base_mint
              ? poolRow.token_a
              : poolRow.token_b;
          const logoUri =
            baseToken?.logo_uri ??
            poolRow.token_a?.logo_uri ??
            poolRow.token_b?.logo_uri ??
            "";

          const totalFeePct = Number(
            poolRow.total_fee_pct ??
              poolRow.base_fee_pct ??
              poolRow.dynamic_fee_pct ??
              0,
          );
          const feeLabel =
            totalFeePct > 0
              ? `${totalFeePct.toFixed(2)}%`
              : `${poolRow.bin_step}%`;

          const formatAge = (seconds?: number) => {
            if (seconds === undefined || seconds === null) return "N/A";
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            if (days > 0) return `${days}d ${hours}h`;
            if (hours > 0) return `${hours}h`;
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${minutes}m`;
          };
          const ageLabel = formatAge(poolRow.age_seconds);

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
                  <AvatarImage src={logoUri} />
                  <AvatarFallback className="shimmer text-xs">
                    {getInitials(pair)}
                  </AvatarFallback>
                  <Icon className="absolute right-0 bottom-0" />
                </Avatar>
                <div>
                  <p className="font-semibold text-b-2 text-white">{pair}</p>
                  <p className="text-muted-foreground text-xs">
                    Tick Spacing: {poolRow.tick_spacing} Fee: {feeLabel}
                  </p>
                  <p className="text-muted-foreground text-xs">{ageLabel}</p>
                </div>
              </div>
            </div>
          );
        },
        size: 270,
      },
      {
        id: "marketCap",
        accessorKey: "market_cap_usd",
        header: "Market Cap",
        cell: ({ row }) => (
          <ValueChangeCell
            value={formatCompactCurrency(row.original.market_cap_usd)}
            change={formatSignedPercent(row.original.price_change_24h_pct)}
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
            value={formatCompactCurrency(row.original.tvl_usd)}
            change={formatSignedPercent(
              (row.original as any).tvl_change_pct ?? null,
            )}
          />
        ),
        size: 100,
      },
      {
        id: "activeTvl",
        accessorKey: "tvl_usd",
        header: "Active TVL",
        cell: ({ row }) => (
          <ValueChangeCell
            value={formatCompactCurrency(
              (row.original as any).active_tvl_usd ?? row.original.tvl_usd,
            )}
            change={formatSignedPercent(
              (row.original as any).active_tvl_change_pct ?? null,
            )}
          />
        ),
        size: 100,
      },
      {
        id: "fees",
        accessorKey: "volume_24h_usd",
        header: "Fees",
        cell: ({ row }) => {
          const poolRow = row.original;
          const totalFeePct = Number(
            poolRow.total_fee_pct ??
              poolRow.base_fee_pct ??
              poolRow.dynamic_fee_pct ??
              0,
          );
          const feesValue =
            (poolRow as any).fees_usd ??
            (poolRow.volume_24h_usd ?? 0) * (totalFeePct / 100);
          return (
            <ValueChangeCell
              value={formatCompactCurrency(feesValue)}
              change={formatSignedPercent(
                (poolRow as any).fees_change_pct ?? null,
              )}
            />
          );
        },
        size: 100,
      },
      {
        id: "feesRatio",
        accessorKey: "volume_24h_usd",
        header: "Fees/Active TVL",
        cell: ({ row }) => {
          const poolRow = row.original;
          const totalFeePct = Number(
            poolRow.total_fee_pct ??
              poolRow.base_fee_pct ??
              poolRow.dynamic_fee_pct ??
              0,
          );
          const feesValue =
            (poolRow as any).fees_usd ??
            (poolRow.volume_24h_usd ?? 0) * (totalFeePct / 100);
          const activeTvl =
            (poolRow as any).active_tvl_usd ?? poolRow.tvl_usd ?? 0;
          const ratio = activeTvl > 0 ? (feesValue / activeTvl) * 100 : 0;
          return (
            <ValueChangeCell
              value={ratio > 0 ? `${ratio.toFixed(2)}%` : "N/A"}
              change={formatSignedPercent(
                (poolRow as any).fees_ratio_change_pct ?? null,
              )}
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "volume_24h_usd",
        header: "Vol",
        cell: ({ row }) => (
          <ValueChangeCell
            value={formatCompactCurrency(row.original.volume_24h_usd)}
            change={formatSignedPercent(row.original.volume_change_pct)}
          />
        ),
        size: 100,
      },
      {
        id: "volumeRatio",
        accessorKey: "volume_24h_usd",
        header: "Vol/Active TVL",
        cell: ({ row }) => {
          const poolRow = row.original;
          const activeTvl =
            (poolRow as any).active_tvl_usd ?? poolRow.tvl_usd ?? 0;
          const ratio =
            activeTvl > 0
              ? ((poolRow.volume_24h_usd ?? 0) / activeTvl) * 100
              : 0;
          return (
            <ValueChangeCell
              value={ratio > 0 ? `${ratio.toFixed(2)}%` : "N/A"}
              change={formatSignedPercent(
                (poolRow as any).volume_ratio_change_pct ?? null,
              )}
            />
          );
        },
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

  const table = useDataTable({
    data: pools.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const pinnedColumnClassName = cn(
    "bg-background data-[column-id=action]:sticky data-[column-id=action]:right-0 data-[column-id=action]:shadow-[inset_1px_0_var(--color-border)]",
    "w-auto!",
  );

  return (
    <QueryState query={pools}>
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
    </QueryState>
  );
}
