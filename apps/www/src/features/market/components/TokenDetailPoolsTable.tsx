import { createColumnHelper } from "@tanstack/react-table";
import type { TokenPool } from "@rhivadotfun/dataapi";

import { useTokenPools } from "../market.hook";
import { CopyButton } from "@/components/ui/button";
import { QueryState } from "@/components/layout/QueryState";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { formatAge } from "@/lib";

const columnHelper = createColumnHelper<TokenPool>();

const columns = [
  columnHelper.accessor("pool", {
    header: "Pool Address",
    cell: ({ getValue }) => {
      const address = getValue();
      return (
        <span className="flex items-center gap-1 font-mono text-xs">
          {address.slice(0, 4)}...{address.slice(-4)}
          <CopyButton copy={address} />
        </span>
      );
    },
    size: 140,
  }),
  columnHelper.accessor("dex", {
    header: "DEX",
    cell: ({ getValue }) => (
      <span className="font-semibold text-white text-xs capitalize">
        {getValue()}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor("price_usd", {
    header: "Price (USD)",
    cell: ({ getValue }) => (
      <span className="text-xs">{formatCompactCurrency(getValue())}</span>
    ),
    size: 110,
  }),
  columnHelper.accessor("liquidity_usd", {
    header: "Liquidity",
    cell: ({ getValue, row }) => (
      <span className="font-medium text-white text-xs">
        {formatCompactCurrency(getValue() || row.original.tvl_usd)}
      </span>
    ),
    size: 110,
  }),
  columnHelper.accessor("volume_usd", {
    header: "Volume (USD)",
    cell: ({ getValue }) => (
      <span className="text-xs">{formatCompactCurrency(getValue())}</span>
    ),
    size: 110,
  }),
  columnHelper.accessor("trades", {
    header: "Trades",
    cell: ({ getValue }) => (
      <span className="text-xs">{formatCompactNumber(getValue())}</span>
    ),
    size: 90,
  }),
  columnHelper.accessor("lp_burn_pct", {
    header: "LP Burn",
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="text-up text-xs">
          {val != null ? `${formatCompactNumber(val)}%` : "--"}
        </span>
      );
    },
    size: 90,
  }),
  columnHelper.accessor("created_time", {
    header: "Age",
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

type TokenDetailPoolsTableProps = { mint: string };

export const TokenDetailPoolsTable = ({ mint }: TokenDetailPoolsTableProps) => {
  const query = useTokenPools(mint);

  const table = useDataTable({
    data: query.data ?? [],
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
