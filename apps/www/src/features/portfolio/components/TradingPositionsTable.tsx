import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Share } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-button";
import { SolanaIcon } from "@/components/ui/icons";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { POSITIONS } from "@/data/portfolio-data";
import { capitalize } from "@/lib/utils";
import { PnlExportDialog } from "./PnlExportDialog";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<(typeof POSITIONS)[0]>();

const columns = [
  columnHelper.accessor((row) => row, {
    header: "Token",
    cell: ({ row }) => (
      <div
        className="group flex items-center gap-2 transition-opacity hover:opacity-80"
        data-token-id={row.original.token}
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
              {row.original.token}
            </p>
            <CopyButton />
          </div>
          <p className="text-b-5 text-gray">{row.original.symbol}</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("boughtAmount", {
    header: "Bought",
    cell: ({ row }) => (
      <p className="font-medium text-up">{row.original.boughtUsd}</p>
    ),
  }),
  columnHelper.accessor("soldAmount", {
    header: "Sold",
    cell: ({ row }) => (
      <p className="font-medium text-sell">{row.original.soldUsd}</p>
    ),
  }),
  columnHelper.accessor("remainingAmount", {
    header: "Remaining",
    cell: ({ row }) => (
      <p className="font-medium text-white">{row.original.remainingUsd}</p>
    ),
  }),
  columnHelper.accessor("pnlPct", {
    header: "PNL",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <p className="font-medium text-b-3 text-up">{row.original.pnlUsd}</p>
        <p className="text-b-3 text-up/60">{row.original.pnlPct}</p>
      </div>
    ),
  }),
  columnHelper.accessor("holding", {
    header: "Holding Duration",
    cell: ({ row }) => (
      <p className="text-b-3 text-gray">{row.original.holding}</p>
    ),
  }),
  columnHelper.display({
    id: "action",
    header: "Action",
    cell: () => (
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
        <PnlExportDialog>
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

export const TradingPositionsTable = () => {
  const router = useRouter();
  const table = useDataTable({ data: POSITIONS, columns });
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
            tableRow?.querySelector<HTMLElement>("[data-token-id]]")?.dataset
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
