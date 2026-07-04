import React from "react";
import { DataTable, useDataTable } from "../ui/table/data-table";
import { POSITIONS } from "@/data/portfolio-data";
import { createColumnHelper } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { ArrowUpDown, EyeOff, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <LinkWrapper className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
        <Avatar className="size-8">
          <AvatarFallback className="bg-linear-to-br from-cyan-400 to-indigo-500 text-white">
            S
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-b-3 font-medium text-white group-hover:text-primary transition-colors">
            {row.original.token}
          </p>
          <p className="text-b-5 text-gray">{row.original.symbol}</p>
        </div>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("boughtAmount", {
    header: "Bought",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="text-b-3 font-medium text-up">{row.original.boughtUsd}</p>
        <p className="text-b-5 text-gray">{row.original.boughtAmount}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("soldAmount", {
    header: "Sold",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="text-b-3 font-medium text-warning">
          {row.original.soldUsd}
        </p>
        <p className="text-b-5 text-gray">{row.original.soldAmount}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("remainingAmount", {
    header: "Remaining",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="text-b-3 font-medium text-white">
          {row.original.remainingUsd}
        </p>
        <p className="text-b-5 text-gray">{row.original.remainingAmount}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("pnlPct", {
    header: "PNL",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="text-b-3 font-medium text-up">{row.original.pnlUsd}</p>
        <p className="text-b-5 text-up">{row.original.pnlPct}</p>
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
      <LinkWrapper className="flex items-center gap-3 text-gray">
        <EyeOff className="size-4" />
        <ArrowUpDown className="size-4" />
        <Share2 className="size-4" />
      </LinkWrapper>
    ),
  }),
];

export const TradingPositionsTable = () => {
  const table = useDataTable({ data: POSITIONS, columns });

  return <DataTable table={table} />;
};
