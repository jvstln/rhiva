import { createColumnHelper } from "@tanstack/react-table";
import type { TokenHolders } from "@rhivadotfun/dataapi";

import { useTokenHolders } from "../market.hook";
import { CopyButton } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import { QueryState } from "@/components/layout/QueryState";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedUsd,
} from "@/lib/finance.util";
import { cn } from "@/lib";

type HolderItem = TokenHolders["top"][number];

const columnHelper = createColumnHelper<HolderItem>();

const createColumns = (decimals: number) => [
  columnHelper.display({
    id: "rank",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{row.index + 1}</span>
    ),
    size: 40,
  }),
  columnHelper.accessor("owner", {
    header: "Wallet",
    cell: ({ getValue, row }) => {
      const address = getValue();
      const tags = row.original.tags ?? [];
      return (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span>
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
          <CopyButton copy={address} />
          {tags.slice(0, 2).map((tag) => (
            <InfoBadge
              key={tag}
              className="text-[10px]"
            >
              {tag}
            </InfoBadge>
          ))}
        </div>
      );
    },
    size: 200,
  }),
  columnHelper.accessor("pct", {
    header: "Hold %",
    cell: ({ getValue }) => {
      const pct = getValue();
      return (
        <span
          className={cn(
            "font-medium text-xs",
            pct > 10 ? "text-down" : pct > 5 ? "text-warn" : "text-up",
          )}
        >
          {formatCompactNumber(pct)}%
        </span>
      );
    },
    size: 100,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = Number(getValue()) / 10 ** decimals;
      return (
        <InfoBadge
          variant="none"
          tooltip={amount.toLocaleString()}
        >
          {formatCompactNumber(amount)}
        </InfoBadge>
      );
    },
    size: 120,
  }),
  columnHelper.accessor("value_usd", {
    header: "Value (USD)",
    cell: ({ getValue }) => (
      <span className="font-medium text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 120,
  }),
  columnHelper.accessor("realized_usd", {
    header: "Realized PnL",
    cell: ({ getValue }) => {
      const val = getValue();
      if (val == null) return "--";
      return (
        <span
          className={cn(
            "font-medium text-xs",
            val > 0
              ? "text-up"
              : val < 0
                ? "text-down"
                : "text-muted-foreground",
          )}
        >
          {formatSignedUsd(val)}
        </span>
      );
    },
    size: 120,
  }),
  columnHelper.accessor("txs_7d", {
    header: "7D Txs",
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="text-muted-foreground text-xs">
          {val != null ? formatCompactNumber(val) : "--"}
        </span>
      );
    },
    size: 80,
  }),
];

type TokenDetailHoldersTableProps = { mint: string };

export const TokenDetailHoldersTable = ({
  mint,
}: TokenDetailHoldersTableProps) => {
  const holdersQuery = useTokenHolders(mint);
  const decimals = holdersQuery.data?.decimals ?? 6;
  const columns = createColumns(decimals);

  const table = useDataTable({
    data: holdersQuery.data?.top ?? [],
    columns,
  });

  return (
    <QueryState query={holdersQuery}>
      <DataTable
        table={table}
        variant="compact"
      />
    </QueryState>
  );
};
