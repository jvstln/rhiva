"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletBalance } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { truncateString } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/ui/button/copy-button";
import { SolanaIcon } from "@/components/ui/icons";

type BalanceTokenItem = WalletBalance["tokens"][number];

const columnHelper = createColumnHelper<BalanceTokenItem>();

const columns = [
  columnHelper.accessor((row) => row, {
    id: "token",
    header: "Token",
    cell: ({ row }) => {
      const token = row.original;
      const initial = (token.symbol || token.name || "T")
        .slice(0, 1)
        .toUpperCase();

      return (
        <div
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
          data-token-id={token.mint}
        >
          <Avatar
            variant="square"
            className="size-8 rounded-md"
          >
            <AvatarImage
              src={token.uri || undefined}
              alt={token.symbol || token.name}
            />
            <AvatarFallback className="border border-border/40 bg-surface-2 font-bold font-sans text-white text-xs">
              {initial || <SolanaIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-medium text-b-3 text-white">
                {token.symbol || token.name}
              </p>
              {token.name && token.name !== token.symbol && (
                <span className="truncate text-b-4 text-gray">
                  {token.name}
                </span>
              )}
              <CopyButton copy={token.mint} />
            </div>
            <p className="truncate font-mono text-[11px] text-muted-foreground/80">
              {truncateString(token.mint, 4)}
            </p>
          </div>
        </div>
      );
    },
    size: 260,
  }),
  columnHelper.accessor("ui_amount", {
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-medium text-sm text-white">
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
      return <span className="text-sm text-white">{formatted}</span>;
    },
    size: 140,
  }),
  columnHelper.accessor("value_usd", {
    header: "Value",
    cell: ({ getValue }) => (
      <span className="font-medium text-sm text-white">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 140,
  }),
  columnHelper.accessor("program", {
    header: "Program",
    cell: ({ getValue }) => (
      <span className="font-mono text-b-4 text-gray uppercase">
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
  const router = useRouter();
  const data = useMemo(() => tokens, [tokens]);

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
