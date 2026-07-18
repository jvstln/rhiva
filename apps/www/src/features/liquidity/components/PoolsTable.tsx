"use client";

import {
  type ColumnDef,
  createColumnHelper,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { Rocket, Star } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
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
import { POOLS as POOLS_DATA, type PoolRow } from "@/data/liquidity-data";
import { gsap } from "@/lib/gsap.util";
import { cn, getInitials } from "@/lib/utils";
import { POOLS, type Pool } from "../liquidity.schema";
import { useLiquidityStore } from "../liquidity.store";

const stats = [
  { label: "Swap", value: "848", change: "+567%", color: "text-emerald-400" },
  {
    label: "Traders",
    value: "273",
    change: "+600%",
    color: "text-emerald-400",
  },
  {
    label: "Total LPs",
    value: "16",
    change: "+128%",
    color: "text-emerald-400",
  },
  { label: "Net deposit", value: "$1.28k", change: null, color: "text-white" },
  {
    label: "Holders",
    value: "999",
    change: "+29.34%",
    color: "text-emerald-400",
  },
  { label: "Avg Vol/", value: "$104.12", change: null, color: "text-white" },
  { label: "Min Volatility", value: "6.2%", change: null, color: "text-white" },
  {
    label: "Top 10 Holders",
    value: "22.34%",
    change: null,
    color: "text-orange-500",
  },
  {
    label: "Dev Balance",
    value: "0.25%",
    change: null,
    color: "text-cyan-400",
  },
];

const parseNumericValue = (val: string): number => {
  const clean = val.replace(/[$,%]/g, "").trim();
  if (clean.toLowerCase().endsWith("k")) return parseFloat(clean) * 1000;
  if (clean.toLowerCase().endsWith("m")) return parseFloat(clean) * 1000000;
  if (clean.toLowerCase().endsWith("b")) return parseFloat(clean) * 1000000000;
  return parseFloat(clean) || 0;
};

const numericSort = (
  rowA: Row<PoolRow>,
  rowB: Row<PoolRow>,
  columnId: string,
) => {
  const a = parseNumericValue(rowA.getValue(columnId) as string);
  const b = parseNumericValue(rowB.getValue(columnId) as string);
  return a - b;
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

export function LinkWrapper({
  className,
  children,
  href,
}: {
  className?: string;
  children: React.ReactNode;
  href?: Route;
}) {
  return (
    <Link
      href={href || "/liquidity/pool"}
      className={cn("block", className)}
    >
      {children}
    </Link>
  );
}

const columnHelper = createColumnHelper<PoolRow>();

export function PoolsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pool, setPool] = React.useState<Pool | "all">("all");

  const columns = React.useMemo<ColumnDef<PoolRow>[]>(
    () => [
      {
        id: "pool",
        header: () => {
          return (
            <ToggleGroup
              defaultValue={[pool]}
              onValueChange={([value]) => setPool(value as Pool)}
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
            <div className="flex items-center gap-2">
              <Button
                size="icon-sm"
                variant={"ghost"}
                aria-label="Add to watchlist"
              >
                <Star />
              </Button>

              <LinkWrapper
                href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
                className="flex items-center gap-3"
              >
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
              </LinkWrapper>
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
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.marketCap}
              change={row.original.marketCapChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
        size: 100,
      },
      {
        id: "tvl",
        accessorKey: "tvl",
        header: "TVL",
        cell: ({ row }) => (
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.tvl}
              change={row.original.tvlChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
        size: 100,
      },
      {
        id: "activeTvl",
        accessorKey: "activeTvl",
        header: "Active TVL",
        cell: ({ row }) => (
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.activeTvl}
              change={row.original.activeTvlChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
        size: 100,
      },
      {
        id: "fees",
        accessorKey: "fees",
        header: "Fees",
        cell: ({ row }) => (
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.fees}
              change={row.original.feesChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
        size: 100,
      },
      {
        id: "feesRatio",
        accessorKey: "feesRatio",
        header: "Fees/Active TVL",
        cell: ({ row }) => (
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.feesRatio}
              change={row.original.feesRatioChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
        size: 100,
      },
      {
        accessorKey: "volume",
        header: "Vol",
        cell: ({ row }) => (
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.volume}
              change={row.original.volumeChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
        size: 100,
      },
      {
        accessorKey: "volumeRatio",
        header: "Vol/Active TVL",
        cell: ({ row }) => (
          <LinkWrapper
            href={`/liquidity/pool?dex=${pool === "all" ? (["meteora", "orca", "raydium"] as const)[row.index % 3] : pool}`}
          >
            <ValueChangeCell
              value={row.original.volumeRatio}
              change={row.original.volumeRatioChange}
            />
          </LinkWrapper>
        ),
        sortingFn: numericSort,
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
    [pool],
  );

  const table = useDataTable({
    data: POOLS_DATA,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const pinnedColumnClassName = cn(
    "data-[column-id=action]:sticky data-[column-id=action]:right-0 data-[column-id=action]:shadow-[inset_1px_0_var(--color-border)] bg-background",
    "w-auto!",
  );

  return (
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
  );
}
