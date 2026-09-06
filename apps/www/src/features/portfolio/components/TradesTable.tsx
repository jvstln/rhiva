"use client";

import { useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletTrade } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { cn, formatAge } from "@/lib";
import { truncateString } from "@/lib/utils";

const columnHelper = createColumnHelper<WalletTrade>();

const columns = [
  columnHelper.accessor("block_time", {
    header: "Age",
    cell: ({ getValue }) => {
      const val = getValue();
      const timestamp = val > 1_000_000_000_000 ? val : val * 1000;
      return (
        <span
          className="text-muted-foreground text-xs"
          title={new Date(timestamp).toLocaleString()}
        >
          {formatAge(timestamp)}
        </span>
      );
    },
    size: 90,
  }),
  columnHelper.accessor("mint", {
    header: "Token",
    cell: ({ getValue }) => {
      const mint = getValue();
      return (
        <Link
          href={`/token/${mint}`}
          className="font-mono text-white text-xs hover:underline"
        >
          {truncateString(mint, 12)}
        </Link>
      );
    },
    size: 140,
  }),
  columnHelper.accessor("side", {
    header: "Type",
    cell: ({ getValue }) => {
      const side = getValue();
      return (
        <span
          className={cn(
            "font-semibold text-xs uppercase",
            side === "buy" ? "text-up" : "text-down",
          )}
        >
          {side}
        </span>
      );
    },
    size: 80,
  }),
  columnHelper.accessor("price_usd", {
    header: "Price",
    cell: ({ getValue }) => (
      <span className="text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 110,
  }),
  columnHelper.accessor("volume_usd", {
    header: "Total (USD)",
    cell: ({ getValue }) => (
      <span className="font-medium text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 110,
  }),
  columnHelper.accessor("base_amount", {
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="text-white text-xs">
        {formatCompactNumber(getValue())}
      </span>
    ),
    size: 110,
  }),
  columnHelper.accessor("signature", {
    header: "Tx",
    cell: ({ getValue }) => {
      const sig = getValue();
      if (!sig) return "--";
      return (
        <a
          href={`https://solscan.io/tx/${sig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-muted-foreground text-xs hover:text-white hover:underline"
        >
          {truncateString(sig, 8)}
        </a>
      );
    },
    size: 100,
  }),
];

type TradesTableProps = {
  trades?: WalletTrade[];
};

export const TradesTable = ({ trades = [] }: TradesTableProps) => {
  const data = useMemo(() => trades, [trades]);

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
