"use client";

import { useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletBalance } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { truncateString } from "@/lib/utils";

type BalanceTokenItem = WalletBalance["tokens"][number];

const columnHelper = createColumnHelper<BalanceTokenItem>();

const getLetterBg = (letter: string) => {
  const colors = [
    "bg-purple-950/60 border-purple-800/40 text-purple-300",
    "bg-blue-950/60 border-blue-800/40 text-blue-300",
    "bg-teal-950/60 border-teal-800/40 text-teal-300",
    "bg-emerald-950/60 border-emerald-800/40 text-emerald-300",
    "bg-amber-950/60 border-amber-800/40 text-amber-300",
    "bg-rose-950/60 border-rose-800/40 text-rose-300",
  ];
  const charCode = (letter.charCodeAt(0) || 0) % colors.length;
  return colors[charCode];
};

const columns = [
  columnHelper.accessor((row) => row, {
    id: "token",
    header: "Token",
    cell: ({ row }) => {
      const token = row.original;
      const initial = (token.symbol || token.name || "T")
        .slice(0, 1)
        .toUpperCase();
      const colorClass = getLetterBg(initial);

      return (
        <Link
          href={`/token/${token.mint}`}
          className="group flex items-center gap-3 py-1 text-left transition-opacity hover:opacity-85"
        >
          <div
            className={`flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border font-bold text-xs ${colorClass}`}
          >
            {token.uri ? (
              // biome-ignore lint/performance/noImgElement: external dynamic token uri
              <img
                src={token.uri}
                alt={token.symbol || token.name}
                className="size-full rounded-md object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              initial
            )}
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="font-semibold text-white text-xs">
              {token.symbol}{" "}
              <span className="font-normal text-muted-foreground">
                {token.name}
              </span>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground/80">
              {truncateString(token.mint, 4)}
            </span>
          </div>
        </Link>
      );
    },
    size: 260,
  }),
  columnHelper.accessor("ui_amount", {
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-medium text-white text-xs">
        {formatCompactNumber(getValue())}
      </span>
    ),
    size: 140,
  }),
  columnHelper.accessor("price_usd", {
    header: "Price",
    cell: ({ getValue }) => {
      const price = getValue();
      const formatted =
        price === 0
          ? "$0"
          : price >= 1
            ? formatCompactCurrency(price)
            : `$${formatCompactNumber(price, { decimals: 5, subscriptThreshold: 4, significantDigits: 3 })}`;
      return <span className="text-white text-xs">{formatted}</span>;
    },
    size: 140,
  }),
  columnHelper.accessor("value_usd", {
    header: "Value",
    cell: ({ getValue }) => (
      <span className="font-medium text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 140,
  }),
  columnHelper.accessor("program", {
    header: "Program",
    cell: ({ getValue }) => (
      <span className="font-mono text-muted-foreground text-xs">
        {getValue() || "spl"}
      </span>
    ),
    size: 100,
  }),
];

type BalancesTableProps = {
  tokens?: BalanceTokenItem[];
};

export const BalancesTable = ({ tokens = [] }: BalancesTableProps) => {
  const data = useMemo(() => tokens, [tokens]);

  const table = useDataTable({
    data,
    columns,
  });

  return (
    <div className="w-full">
      <DataTable
        table={table}
        variant="compact"
      />
    </div>
  );
};
