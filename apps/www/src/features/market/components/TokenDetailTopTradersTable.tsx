import { createColumnHelper } from "@tanstack/react-table";
import type { TokenTopTrader } from "@rhivadotfun/dataapi";

import { useTokenTopTraders } from "../market.hook";
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

const columnHelper = createColumnHelper<TokenTopTrader>();

const columns = [
  columnHelper.display({
    id: "rank",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{row.index + 1}</span>
    ),
    size: 40,
  }),
  columnHelper.accessor("wallet", {
    header: "Trader",
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
    size: 180,
  }),
  columnHelper.accessor("pnl_usd", {
    header: "Total PnL",
    cell: ({ getValue, row }) => {
      const pnl = getValue() ?? row.original.realized_usd;
      const pct = row.original.pnl_pct;
      return (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-medium text-xs",
              pnl > 0 ? "text-up" : pnl < 0 ? "text-down" : "text-white",
            )}
          >
            {formatSignedUsd(pnl)}
          </span>
          {pct != null && (
            <span
              className={cn(
                "text-[10px]",
                pct > 0
                  ? "text-up"
                  : pct < 0
                    ? "text-down"
                    : "text-muted-foreground",
              )}
            >
              {formatCompactNumber(pct, { withSign: true })}%
            </span>
          )}
        </div>
      );
    },
    size: 120,
  }),
  columnHelper.accessor("invested_usd", {
    header: "Invested",
    cell: ({ getValue }) => (
      <span className="text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor("proceeds_usd", {
    header: "Realized",
    cell: ({ getValue }) => (
      <span className="text-white text-xs">
        {formatCompactCurrency(getValue())}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor("remaining_ui", {
    header: "Holding",
    cell: ({ getValue, row }) => {
      const ui =
        getValue() || row.original.holding / 10 ** (row.original.decimals || 6);
      return (
        <InfoBadge
          variant="none"
          tooltip={ui.toLocaleString()}
        >
          {formatCompactNumber(ui)}
        </InfoBadge>
      );
    },
    size: 110,
  }),
  columnHelper.display({
    id: "txns",
    header: "Buys / Sells",
    cell: ({ row }) => (
      <span className="text-xs">
        <span className="text-up">{row.original.buys ?? 0}</span>
        {" / "}
        <span className="text-down">{row.original.sells ?? 0}</span>
      </span>
    ),
    size: 100,
  }),
];

type TokenDetailTopTradersTableProps = { mint: string };

export const TokenDetailTopTradersTable = ({
  mint,
}: TokenDetailTopTradersTableProps) => {
  const query = useTokenTopTraders(mint);

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
