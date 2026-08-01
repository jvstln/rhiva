import type { TradeRow } from "@rhivadotfun/dataapi";
import { createColumnHelper } from "@tanstack/react-table";

import { useTokenTrades } from "../market.hook";
import { CopyButton } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import { QueryState } from "@/components/layout/QueryState";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";

const columnHelper = createColumnHelper<TradeRow>();

const columns = [
  columnHelper.accessor("block_time", {
    header: "Age",
    cell: ({ getValue }) => {
      const value = Number(getValue());
      const timestamp = value > 1_000_000_000_000 ? value : value * 1000;
      return new Date(timestamp).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },
  }),
  columnHelper.accessor("side", {
    header: "Type",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),
  columnHelper.accessor("sol_amount", {
    header: "SOL Amount",
    cell: ({ getValue }) => formatCompactNumber(getValue()),
  }),
  columnHelper.accessor("token_amount", {
    header: "Token Amount",
    cell: ({ getValue }) => {
      const val = getValue();
      const numVal = Number(val);
      return (
        <InfoBadge
          variant="none"
          tooltip={numVal.toLocaleString()}
        >
          {formatCompactNumber(numVal)}
        </InfoBadge>
      );
    },
  }),
  columnHelper.accessor("price_usd", {
    header: "Price (USD)",
    cell: ({ getValue }) => formatCompactCurrency(getValue()),
  }),
  columnHelper.accessor("wallet", {
    header: "Trader",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">
        {getValue().slice(0, 6)}...{getValue().slice(-6)}
        <CopyButton copy={getValue()} />
      </span>
    ),
  }),
];

type TokenDetailTradesTableProps = { mint: string };
export const TokenDetailTradesTable = ({
  mint,
}: TokenDetailTradesTableProps) => {
  const trades = useTokenTrades(mint);

  const table = useDataTable({
    data: trades.data ?? [],
    columns,
  });

  return (
    <QueryState query={trades}>
      <DataTable
        table={table}
        variant="compact"
      />
    </QueryState>
  );
};
