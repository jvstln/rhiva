import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Share } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
import { PnlExportDialog } from "./PnlExportDialog";
import { CopyButton } from "@/components/ui/button/copy-button";
import {
  formatCompactCurrency,
  formatSignedPercent,
  formatSignedUsd,
} from "@/lib/finance.util";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TokenPosition } from "@rhivadotfun/dataapi";

const columnHelper = createColumnHelper<TokenPosition>();

const positionPnlUsd = (position: TokenPosition) =>
  position.realized_pnl_usd + (position.unrealized_pnl_usd ?? 0);

const positionInvestedUsd = (position: TokenPosition) =>
  position.bought * position.avg_buy_price_usd;

const positionPnlPct = (position: TokenPosition) => {
  const invested = positionInvestedUsd(position);
  return invested > 0 ? (positionPnlUsd(position) / invested) * 100 : null;
};

const formatHoldingDuration = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

const columns = [
  columnHelper.accessor((row) => row, {
    header: "Token",
    cell: ({ row }) => (
      <div
        className="group flex items-center gap-2 transition-opacity hover:opacity-80"
        data-token-id={row.original.mint}
      >
        <Avatar>
          <AvatarImage />
          <AvatarFallback>
            <SolanaIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-b-3 text-white">
              {row.original.symbol ?? row.original.mint}
            </p>
            <CopyButton copy={row.original.mint} />
          </div>
          <p className="text-b-5 text-gray">{row.original.mint}</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor((row) => positionInvestedUsd(row), {
    header: "Bought",
    cell: ({ row }) => (
      <p className="font-medium text-up">
        {formatCompactCurrency(positionInvestedUsd(row.original))}
      </p>
    ),
  }),
  columnHelper.accessor((row) => row.sold * row.avg_buy_price_usd, {
    header: "Sold",
    cell: ({ row }) => (
      <p className="font-medium text-sell">
        {formatCompactCurrency(
          row.original.sold * row.original.avg_buy_price_usd,
        )}
      </p>
    ),
  }),
  columnHelper.accessor((row) => row.remaining, {
    header: "Remaining",
    cell: ({ row }) => (
      <p className="font-medium text-white">
        {row.original.current_price_usd != null
          ? formatCompactCurrency(
              row.original.remaining * row.original.current_price_usd,
            )
          : "-"}
      </p>
    ),
  }),
  columnHelper.accessor((row) => positionPnlPct(row), {
    header: "PNL",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <p className="font-medium text-b-3 text-up">
          {formatSignedUsd(positionPnlUsd(row.original))}
        </p>
        <p className="text-b-3 text-up/60">
          {formatSignedPercent(positionPnlPct(row.original))}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.holding_duration_secs, {
    header: "Holding Duration",
    cell: ({ row }) => (
      <p className="text-b-3 text-gray">
        {formatHoldingDuration(row.original.holding_duration_secs)}
      </p>
    ),
  }),
  columnHelper.display({
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          tooltip="Sell"
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ArrowUpDown className="text-gray" />
        </Button>
        <PnlExportDialog token={row.original}>
          <Button
            tooltip="Share"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Share className="text-gray" />
          </Button>
        </PnlExportDialog>
      </div>
    ),
  }),
];

const filters = ["activePositions", "history"];

export const TradingPositionsTable = ({
  positions,
}: {
  positions: TokenPosition[];
}) => {
  const router = useRouter();
  const table = useDataTable({ data: positions, columns });
  const [activeFilter, setActiveFilter] = useState("activePositions");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            variant={"ghost"}
            size="sm"
            data-active={activeFilter === filter ? true : undefined}
          >
            {capitalize(filter)}
          </Button>
        ))}
      </div>
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
      >
        <DataTable table={table} />
      </nav>
    </div>
  );
};
