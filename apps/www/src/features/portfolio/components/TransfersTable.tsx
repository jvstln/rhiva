"use client";

import { useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletTransfer } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { CopyButton } from "@/components/ui/button";
import { cn, formatAge } from "@/lib";
import { truncateString } from "@/lib/utils";

const columnHelper = createColumnHelper<WalletTransfer>();

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
      const initial = (mint || "T").slice(0, 1).toUpperCase();
      return (
        <Link
          href={`/token/${mint}`}
          className="flex items-center gap-2 font-mono text-white text-xs hover:underline"
        >
          <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 font-bold font-sans text-[10px] text-muted-foreground">
            {initial}
          </div>
          <span>{truncateString(mint, 4)}</span>
        </Link>
      );
    },
    size: 140,
  }),
  columnHelper.accessor("direction", {
    header: "Direction",
    cell: ({ getValue }) => {
      const dir = getValue();
      return (
        <span
          className={cn(
            "rounded px-1.5 py-0.5 font-semibold text-[10px] uppercase",
            dir === "in"
              ? "border border-emerald-800/40 bg-emerald-950/60 text-emerald-400"
              : "border border-rose-800/40 bg-rose-950/60 text-rose-400",
          )}
        >
          {dir}
        </span>
      );
    },
    size: 90,
  }),
  columnHelper.accessor("counterparty", {
    header: "Counterparty",
    cell: ({ getValue }) => {
      const cp = getValue();
      if (!cp) return "--";
      return (
        <span className="flex items-center gap-1 font-mono text-white text-xs">
          {truncateString(cp, 4)}
          <CopyButton copy={cp} />
        </span>
      );
    },
    size: 160,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="text-white text-xs">
        {formatCompactNumber(getValue())}
      </span>
    ),
    size: 110,
  }),
  columnHelper.accessor("value_usd", {
    header: "Value (USD)",
    cell: ({ getValue }) => (
      <span className="font-medium text-white text-xs">
        {formatCompactCurrency(getValue())}
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
          {truncateString(sig, 4)}
        </a>
      );
    },
    size: 100,
  }),
];

type TransfersTableProps = {
  transfers?: WalletTransfer[];
};

export const TransfersTable = ({ transfers = [] }: TransfersTableProps) => {
  const data = useMemo(() => transfers, [transfers]);

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
