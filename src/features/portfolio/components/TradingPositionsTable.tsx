import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, EyeOff, Share } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-button";
import { SolanaIcon } from "@/components/ui/icons";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { POSITIONS } from "@/data/portfolio-data";
import { capitalize, cn } from "@/lib/utils";
import { PnlExportDialog } from "./PnlExportDialog";

const columnHelper = createColumnHelper<(typeof POSITIONS)[0]>();

const LinkWrapper = ({
  ...props
}: Partial<React.ComponentProps<typeof Link>>) => (
  <Link {...props} href="/token" className={cn("block", props.className)} />
);

const columns = [
  columnHelper.accessor((row) => row, {
    header: "Token",
    cell: ({ row }) => (
      <LinkWrapper className="group flex items-center gap-2 transition-opacity hover:opacity-80">
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
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("boughtAmount", {
    header: "Bought",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="font-medium text-up">{row.original.boughtUsd}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("soldAmount", {
    header: "Sold",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="font-medium text-sell">{row.original.soldUsd}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("remainingAmount", {
    header: "Remaining",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="font-medium text-white">{row.original.remainingUsd}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("pnlPct", {
    header: "PNL",
    cell: ({ row }) => (
      <LinkWrapper className="flex items-center gap-1.5">
        <p className="font-medium text-b-3 text-up">{row.original.pnlUsd}</p>
        <p className="text-b-3 text-up/60">{row.original.pnlPct}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("holding", {
    header: "Holding Duration",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="text-b-3 text-gray">{row.original.holding}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.display({
    id: "action",
    header: "Action",
    cell: () => (
      <div className="flex items-center gap-1">
        <Button tooltip="Hide" variant="ghost" size="icon-sm">
          <EyeOff className="text-gray" />
        </Button>
        <Button tooltip="Sell" variant="ghost" size="icon-sm">
          <ArrowUpDown className="text-gray" />
        </Button>
        <PnlExportDialog>
          <Button tooltip="Share" variant="ghost" size="icon-sm">
            <Share className="text-gray" />
          </Button>
        </PnlExportDialog>
      </div>
    ),
  }),
];

const filters = ["activePositions", "history"];

export const TradingPositionsTable = () => {
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
      <DataTable table={table} />
    </div>
  );
};
