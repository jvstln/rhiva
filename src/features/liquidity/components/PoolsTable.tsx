"use client";

import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import { Rocket, Star } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MeteoraIcon } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { POOLS as POOLS_DATA, type PoolRow } from "@/data/liquidity-data";
import { cn, getInitials } from "@/lib/utils";
import { POOLS } from "../liquidity.schema";

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
    <div>
      <p className="font-medium text-b-3 text-white">{value}</p>
      <p className={cn("text-b-5", isDown ? "text-down" : "text-up")}>
        {change}
      </p>
    </div>
  );
}

export function LinkWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={"/liquidity/pool"} className={cn("block", className)}>
      {children}
    </Link>
  );
}

const columns: ColumnDef<PoolRow>[] = [
  {
    id: "pool",
    header: () => {
      return (
        <ToggleGroup defaultValue={["all"]}>
          <ToggleGroupItem value="all">All pools</ToggleGroupItem>
          {POOLS.map((pool) => (
            <ToggleGroupItem key={pool.id} value={pool.id}>
              <pool.icon />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      );
    },
    cell: ({ row }) => {
      const pool = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant={"ghost"}
            aria-label="Add to watchlist"
          >
            <Star />
          </Button>

          <LinkWrapper className="flex items-center gap-3">
            <Avatar className="size-9 ring-2 ring-background">
              <AvatarImage
                src={`https://picsum.photos/seed/${pool.pair}/200`}
              />
              <AvatarFallback className="shimmer text-xs">
                {getInitials(pool.pair)}
              </AvatarFallback>
              <MeteoraIcon className="absolute right-0 bottom-0" />
            </Avatar>
            <div>
              <p className="font-semibold text-b-2 text-white">{pool.pair}</p>
              <p className="text-b-5 text-gray">
                Tick Spacing: {pool.tickSpacing} Fee: {pool.fee}
              </p>
              <p className="text-b-5 text-gray">{pool.age}</p>
            </div>
          </LinkWrapper>
        </div>
      );
    },
    size: 240,
  },
  {
    id: "marketCap",
    accessorKey: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.marketCap}
          change={row.original.marketCapChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    id: "tvl",
    accessorKey: "tvl",
    header: "TVL",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.tvl}
          change={row.original.tvlChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    id: "activeTvl",
    accessorKey: "activeTvl",
    header: "Active TVL",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.activeTvl}
          change={row.original.activeTvlChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    id: "fees",
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.fees}
          change={row.original.feesChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    id: "feesRatio",
    accessorKey: "feesRatio",
    header: "Fees/Active TVL",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.feesRatio}
          change={row.original.feesRatioChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    accessorKey: "volume",
    header: "Volume",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.volume}
          change={row.original.volumeChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    accessorKey: "volumeRatio",
    header: "Volume/Active TVL",
    cell: ({ row }) => (
      <LinkWrapper>
        <ValueChangeCell
          value={row.original.volumeRatio}
          change={row.original.volumeRatioChange}
        />
      </LinkWrapper>
    ),
    sortingFn: numericSort,
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex items-center gap-4">
        <Rocket className="size-4 text-primary" />

        <Popover>
          <PopoverTrigger
            openOnHover
            render={<Button size="sm" variant="outline" />}
          >
            More
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0">
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
      </div>
    ),
    enableSorting: false,
  },
];

export function PoolsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useDataTable({
    data: POOLS_DATA,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return <DataTable table={table} />;
}
