"use client";

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Rocket, Star } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { POOLS, type PoolRow } from "@/data/liquidity-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PoolPairIcon, ValueChangeCell } from "./PoolTableCells";

const stats = [
  {
    label: "Swap",
    value: "848",
    change: "+567%",
    color: "text-emerald-400",
  },
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
  {
    label: "Net deposit",
    value: "$1.28k",
    change: null,
    color: "text-white",
  },
  {
    label: "Holders",
    value: "999",
    change: "+29.34%",
    color: "text-emerald-400",
  },
  {
    label: "Avg Vol/",
    value: "$104.12",
    change: null,
    color: "text-white",
  },
  {
    label: "Min Volatility",
    value: "6.2%",
    change: null,
    color: "text-white",
  },
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
  if (clean.toLowerCase().endsWith("k")) {
    return parseFloat(clean) * 1000;
  }
  if (clean.toLowerCase().endsWith("m")) {
    return parseFloat(clean) * 1000000;
  }
  if (clean.toLowerCase().endsWith("b")) {
    return parseFloat(clean) * 1000000000;
  }
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

interface SortHeaderProps {
  column: Column<PoolRow, unknown>;
  title: string;
}

function SortHeader({ column, title }: SortHeaderProps) {
  const isSorted = column.getIsSorted();
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 cursor-pointer select-none text-left font-medium text-gray hover:text-white transition-colors focus:outline-none"
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <ArrowUpDown
        className={cn(
          "size-3 transition-colors",
          isSorted ? "text-primary" : "text-gray/50",
        )}
      />
    </button>
  );
}

const columns: ColumnDef<PoolRow>[] = [
  {
    id: "favorite",
    header: "",
    cell: () => (
      <button
        type="button"
        className="focus:outline-none"
        aria-label="Add to favorites"
      >
        <Star className="size-4 text-gray hover:text-yellow-400 transition-colors cursor-pointer" />
      </button>
    ),
    enableSorting: false,
  },
  {
    id: "pool",
    accessorKey: "pair",
    header: ({ column }) => <SortHeader column={column} title="Pool" />,
    cell: ({ row }) => {
      const pool = row.original;
      return (
        <div className="flex items-center gap-3">
          <PoolPairIcon />
          <div>
            <p className="text-b-2 font-semibold text-white">{pool.pair}</p>
            <p className="text-b-5 text-gray">
              Tick Spacing: {pool.tickSpacing} Fee: {pool.fee}
            </p>
            <p className="text-b-5 text-gray">{pool.age}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "marketCap",
    accessorKey: "marketCap",
    header: ({ column }) => <SortHeader column={column} title="Market Cap" />,
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.marketCap}
        change={row.original.marketCapChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "tvl",
    accessorKey: "tvl",
    header: ({ column }) => <SortHeader column={column} title="TVL" />,
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.tvl}
        change={row.original.tvlChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "activeTvl",
    accessorKey: "activeTvl",
    header: ({ column }) => <SortHeader column={column} title="Active TVL" />,
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.activeTvl}
        change={row.original.activeTvlChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "fees",
    accessorKey: "fees",
    header: ({ column }) => <SortHeader column={column} title="Fees" />,
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.fees}
        change={row.original.feesChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "feesRatio",
    accessorKey: "feesRatio",
    header: ({ column }) => (
      <SortHeader column={column} title="Fees/Active TVL" />
    ),
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.feesRatio}
        change={row.original.feesRatioChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "volume",
    accessorKey: "volume",
    header: ({ column }) => <SortHeader column={column} title="Volume" />,
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.volume}
        change={row.original.volumeChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "volumeRatio",
    accessorKey: "volumeRatio",
    header: ({ column }) => (
      <SortHeader column={column} title="Volume/Active TVL" />
    ),
    cell: ({ row }) => (
      <ValueChangeCell
        value={row.original.volumeRatio}
        change={row.original.volumeRatioChange}
      />
    ),
    sortingFn: numericSort,
  },
  {
    id: "rocket",
    header: "",
    cell: () => <Rocket className="size-4 text-primary" />,
    enableSorting: false,
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="sm" variant={"outline"} />}>
          More
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={"min-w-xs"}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between not-last:border-b border-white/5 px-4"
            >
              <span className="text-sm text-gray-500">{stat.label}</span>

              <div className="text-right">
                <div className={`text-sm font-medium ${stat.color}`}>
                  {stat.value}
                </div>

                {stat.change && (
                  <div className="text-xs text-emerald-400">{stat.change}</div>
                )}
              </div>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];

const getHeaderClassName = (id: string) => {
  switch (id) {
    case "favorite":
      return "w-10 py-3";
    case "rocket":
      return "w-10 py-3";
    case "actions":
      return "w-24 py-3";
    default:
      return "py-3 pr-6 font-medium text-left";
  }
};

const getCellClassName = (id: string) => {
  switch (id) {
    case "favorite":
      return "py-4 pr-2";
    case "rocket":
      return "py-4 pr-2";
    case "actions":
      return "py-4";
    default:
      return "py-4 pr-6";
  }
};

export function PoolsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: POOLS,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto px-6 pb-10">
      <table className="w-full min-w-[1200px] border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-b-3 text-gray">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={getHeaderClassName(header.id)}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="relative border-t border-border/40 hover:bg-muted/10 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cn("relative z-10")}>
                  <Link
                    href="/liquidity/pool"
                    className={cn("block", getCellClassName(cell.column.id))}
                    aria-label={`View pool details for ${row.original.pair}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Link>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
