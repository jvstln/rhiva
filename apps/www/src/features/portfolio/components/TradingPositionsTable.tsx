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
  formatCompactNumber,
  formatSignedUsd,
} from "@/lib/finance.util";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PositionItem } from "../portfolio.type";

const columnHelper = createColumnHelper<PositionItem>();

const positionPnlUsd = (position: PositionItem) =>
  position.pnl_usd ?? position.realized_usd + (position.unrealized_usd ?? 0);

const positionInvestedUsd = (position: PositionItem) =>
  position.invested_usd ?? position.bought * position.avg_buy_usd;

const positionPnlPct = (position: PositionItem) => {
  return (
    position.pnl_pct ??
    (position.invested_usd > 0
      ? (positionPnlUsd(position) / position.invested_usd) * 100
      : null)
  );
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
          <AvatarImage src={row.original.image} />
          <AvatarFallback>
            <SolanaIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-medium text-b-3 text-white">
              {row.original.symbol ?? row.original.mint}
            </p>
            <CopyButton copy={row.original.mint} />
          </div>
          <p className="truncate text-b-5 text-gray">{row.original.mint}</p>
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
  columnHelper.accessor((row) => row.proceeds_usd, {
    header: "Sold",
    cell: ({ row }) => (
      <p className="font-medium text-sell">
        {formatCompactCurrency(
          row.original.proceeds_usd ??
            row.original.sold * row.original.avg_sell_usd,
        )}
      </p>
    ),
  }),
  columnHelper.accessor((row) => row.remaining_ui, {
    header: "Remaining",
    cell: ({ row }) => (
      <p className="font-medium text-white">
        {formatCompactCurrency(
          row.original.value_usd ??
            (row.original.current_price_usd
              ? row.original.remaining_ui * row.original.current_price_usd
              : null),
        )}
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
          {`${formatCompactNumber(positionPnlPct(row.original), { withSign: true })}%`}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.holding_duration_secs, {
    header: "Holding Duration",
    cell: ({ row }) => (
      <p className="text-b-3 text-gray">
        {formatHoldingDuration(row.original.holding_duration_secs ?? 0)}
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
          data-require-auth
        >
          <ArrowUpDown className="text-gray" />
        </Button>
        <PnlExportDialog position={row.original}>
          <Button
            tooltip="Share PnL"
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

type TradingPositionsTableProps = {
  positions: PositionItem[];
};

export const TradingPositionsTable = ({
  positions,
}: TradingPositionsTableProps) => {
  const _router = useRouter();
  const [direction, setDirection] = useState<"all" | "in" | "out">("all");

  const table = useDataTable({
    data: positions,
    columns,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        {(["all", "in", "out"] as const).map((d) => (
          <Button
            key={d}
            variant="outline"
            size="sm"
            className="rounded-full"
            data-active={direction === d ? true : undefined}
            onClick={() => setDirection(d)}
          >
            {capitalize(d)}
          </Button>
        ))}
      </div>

      <DataTable table={table} />
    </div>
  );
};
