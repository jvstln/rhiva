"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletTransfer } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { CopyButton } from "@/components/ui/button/copy-button";
import { cn, formatAge } from "@/lib";
import { truncateString } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SolanaIcon } from "@/components/ui/icons";

const columnHelper = createColumnHelper<WalletTransfer>();

const columns = [
  columnHelper.accessor("block_time", {
    header: "Age",
    cell: ({ getValue }) => {
      const val = getValue();
      const timestamp = val > 1_000_000_000_000 ? val : val * 1000;
      return (
        <span
          className="text-b-4 text-gray"
          title={new Date(timestamp).toLocaleString()}
        >
          {formatAge(timestamp)}
        </span>
      );
    },
    size: 100,
  }),
  columnHelper.accessor("mint", {
    header: "Token",
    cell: ({ getValue }) => {
      const mint = getValue();
      const initial = (mint || "T").slice(0, 1).toUpperCase();
      return (
        <div
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
          data-token-id={mint}
        >
          <Avatar
            variant="square"
            className="size-8 rounded-md"
          >
            <AvatarFallback className="border border-border/40 bg-surface-2 font-bold font-sans text-white text-xs">
              {initial || <SolanaIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-b-3 text-white">
                {truncateString(mint, 4)}
              </span>
              <CopyButton copy={mint} />
            </div>
          </div>
        </div>
      );
    },
    size: 180,
  }),
  columnHelper.accessor("direction", {
    header: "Direction",
    cell: ({ getValue }) => {
      const dir = getValue();
      return (
        <span
          className={cn(
            "rounded px-2 py-0.5 font-medium text-b-4 uppercase",
            dir === "in"
              ? "border border-up/20 bg-up/10 text-up"
              : "border border-sell/20 bg-sell/10 text-sell",
          )}
        >
          {dir}
        </span>
      );
    },
    size: 100,
  }),
  columnHelper.accessor("counterparty", {
    header: "Counterparty",
    cell: ({ getValue }) => {
      const cp = getValue();
      if (!cp) return <span className="text-gray">--</span>;
      return (
        <span className="flex items-center gap-1.5 font-mono text-b-3 text-white">
          <span>{truncateString(cp, 4)}</span>
          <CopyButton copy={cp} />
        </span>
      );
    },
    size: 170,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="text-sm text-white">
        {formatCompactNumber(getValue())}
      </span>
    ),
    size: 120,
  }),
  columnHelper.accessor("value_usd", {
    header: "Value (USD)",
    cell: ({ getValue }) => (
      <span className="font-medium text-sm text-white">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 130,
  }),
  columnHelper.accessor("signature", {
    header: "Tx",
    cell: ({ getValue }) => {
      const sig = getValue();
      if (!sig) return <span className="text-gray">--</span>;
      return (
        <a
          href={`https://solscan.io/tx/${sig}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-b-4 text-gray transition-colors hover:text-white hover:underline"
        >
          {truncateString(sig, 4)}
        </a>
      );
    },
    size: 110,
  }),
];

type TransfersTableProps = {
  transfers?: WalletTransfer[];
};

export const TransfersTable = ({ transfers = [] }: TransfersTableProps) => {
  const router = useRouter();
  const data = useMemo(() => transfers, [transfers]);

  const table = useDataTable({
    data,
    columns,
  });

  return (
    <nav
      onClick={(e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const tableRow = e.target.closest("tr");
        const tokenId =
          tableRow?.querySelector<HTMLElement>("[data-token-id]")?.dataset
            .tokenId;
        if (tokenId) router.push(`/token/${tokenId}`);
      }}
      onKeyDown={() => null}
      className="w-full"
    >
      <DataTable table={table} />
    </nav>
  );
};
