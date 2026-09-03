import { createColumnHelper } from "@tanstack/react-table";
import type { TokenDevHistory } from "@rhivadotfun/dataapi";
import Link from "next/link";

import { useTokenDevHistory } from "../market.hook";
import { CopyButton } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import { QueryState } from "@/components/layout/QueryState";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { cn, formatAge } from "@/lib";

type DevTokenItem = TokenDevHistory["tokens"][number];

const columnHelper = createColumnHelper<DevTokenItem>();

const columns = [
  columnHelper.accessor("name", {
    header: "Token",
    cell: ({ getValue, row }) => (
      <Link
        href={`/token/${row.original.mint}`}
        className="flex items-center gap-1.5 hover:underline"
      >
        <span className="font-semibold text-white text-xs">{getValue()}</span>
        <span className="text-muted-foreground text-xs">
          ({row.original.symbol})
        </span>
        {row.original.is_current && (
          <InfoBadge className="text-[10px] [--accent:var(--color-info)]">
            Current
          </InfoBadge>
        )}
      </Link>
    ),
    size: 160,
  }),
  columnHelper.accessor("mint", {
    header: "Mint",
    cell: ({ getValue }) => {
      const address = getValue();
      return (
        <span className="flex items-center gap-1 font-mono text-xs">
          {address.slice(0, 4)}...{address.slice(-4)}
          <CopyButton copy={address} />
        </span>
      );
    },
    size: 130,
  }),
  columnHelper.accessor("graduated", {
    header: "Status",
    cell: ({ getValue }) => (
      <span
        className={cn(
          "font-medium text-xs",
          getValue() ? "text-up" : "text-warn",
        )}
      >
        {getValue() ? "Graduated" : "Bonding"}
      </span>
    ),
    size: 90,
  }),
  columnHelper.accessor("ath_mcap_usd", {
    header: "ATH MC",
    cell: ({ getValue }) => (
      <span className="text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor("price_usd", {
    header: "Price (USD)",
    cell: ({ getValue }) => (
      <span className="text-xs">{formatCompactCurrency(getValue())}</span>
    ),
    size: 100,
  }),
  columnHelper.accessor("liquidity_usd", {
    header: "Liquidity",
    cell: ({ getValue }) => (
      <span className="text-xs">{formatCompactCurrency(getValue())}</span>
    ),
    size: 100,
  }),
  columnHelper.accessor("holders", {
    header: "Holders",
    cell: ({ getValue }) => (
      <span className="text-xs">{formatCompactNumber(getValue())}</span>
    ),
    size: 80,
  }),
  columnHelper.accessor("created_time", {
    header: "Created",
    cell: ({ getValue }) => {
      const val = getValue();
      const timestamp = val > 1_000_000_000_000 ? val : val * 1000;
      return (
        <span className="text-muted-foreground text-xs">
          {formatAge(timestamp)}
        </span>
      );
    },
    size: 100,
  }),
];

type TokenDetailDevHistoryTableProps = { mint: string };

export const TokenDetailDevHistoryTable = ({
  mint,
}: TokenDetailDevHistoryTableProps) => {
  const query = useTokenDevHistory(mint);

  const table = useDataTable({
    data: query.data?.tokens ?? [],
    columns,
  });

  return (
    <QueryState query={query}>
      <DataTable
        table={table}
        variant="compact"
      />
    </QueryState>
  );
};
