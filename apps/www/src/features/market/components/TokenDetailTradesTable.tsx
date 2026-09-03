import type { TokenTrade } from "@rhivadotfun/dataapi";
import { createColumnHelper } from "@tanstack/react-table";

import { useTokenTrades } from "../market.hook";
import { CopyButton } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import { QueryState } from "@/components/layout/QueryState";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { cn, formatAge } from "@/lib";

const columnHelper = createColumnHelper<TokenTrade>();

const columns = [
  columnHelper.accessor("block_time", {
    header: "Age",
    cell: ({ getValue }) => {
      const value = Number(getValue());
      const timestamp = value > 1_000_000_000_000 ? value : value * 1000;
      return (
        <span
          className="text-xs"
          title={new Date(timestamp).toLocaleString()}
        >
          {formatAge(timestamp)}
        </span>
      );
    },
  }),
  columnHelper.accessor("side", {
    header: "Type",
    cell: ({ getValue }) => (
      <span
        className={cn(
          "font-semibold text-xs capitalize",
          getValue() === "sell" ? "text-down" : "text-up",
        )}
      >
        {getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("price_usd", {
    header: "Price (USD)",
    cell: ({ getValue }) => formatCompactCurrency(getValue()),
  }),
  columnHelper.accessor("volume_usd", {
    header: "Total (USD)",
    cell: ({ getValue }) => formatCompactCurrency(getValue()),
  }),
  columnHelper.accessor("quote_amount", {
    header: "SOL",
    cell: ({ getValue, row }) => {
      const decimals = row.original.quote_decimals ?? 9;
      const amount = Number(getValue()) / 10 ** decimals;
      return <span className="text-xs">{formatCompactNumber(amount)} SOL</span>;
    },
  }),
  columnHelper.accessor("base_amount", {
    header: "Amount",
    cell: ({ getValue, row }) => {
      const decimals = row.original.base_decimals ?? 6;
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
  }),
  columnHelper.accessor("trader", {
    header: "Trader",
    cell: ({ getValue }) => {
      const trader = getValue();
      if (!trader) return "--";
      return (
        <span className="flex items-center gap-1 font-mono text-xs">
          {trader.slice(0, 4)}...{trader.slice(-4)}
          <CopyButton copy={trader} />
        </span>
      );
    },
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
          className="font-mono text-muted-foreground text-xs hover:text-white"
        >
          {sig.slice(0, 4)}...{sig.slice(-4)}
        </a>
      );
    },
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
