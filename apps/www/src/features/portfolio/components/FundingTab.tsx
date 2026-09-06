"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletFunding } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { CopyButton } from "@/components/ui/button/copy-button";
import { formatCompactNumber } from "@/lib/finance.util";
import { formatAge } from "@/lib";
import { truncateString } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SolanaIcon } from "@/components/ui/icons";

type FunderItem = WalletFunding["funders"][number];

const columnHelper = createColumnHelper<FunderItem>();

const columns = [
  columnHelper.accessor("wallet", {
    header: "Funder Address",
    cell: ({ getValue }) => {
      const w = getValue();
      const initial = (w || "W").slice(0, 1).toUpperCase();
      return (
        <div className="flex items-center gap-2.5">
          <Avatar
            variant="square"
            className="size-8 rounded-md"
          >
            <AvatarFallback className="border border-border/40 bg-surface-2 font-bold font-sans text-white text-xs">
              {initial || <SolanaIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>

          <span className="font-mono text-b-3 text-white">
            {truncateString(w, 4)}
          </span>
          <CopyButton copy={w} />
        </div>
      );
    },
    size: 260,
  }),
  columnHelper.accessor("total", {
    header: "Total Funded (SOL)",
    cell: ({ getValue }) => (
      <span className="font-medium text-sm text-up">
        {formatCompactNumber(getValue())} SOL
      </span>
    ),
    size: 160,
  }),
  columnHelper.accessor("transfers", {
    header: "Transfers",
    cell: ({ getValue }) => (
      <span className="text-b-4 text-gray">{getValue()} txs</span>
    ),
    size: 120,
  }),
];

type FundingTabProps = {
  funding?: WalletFunding;
};

export const FundingTab = ({ funding }: FundingTabProps) => {
  const funders = useMemo(() => funding?.funders ?? [], [funding]);

  const table = useDataTable({
    data: funders,
    columns,
  });

  const firstFunder = funding?.first_funder;
  const firstAmount = funding?.first_funded_amount ?? 0;
  const firstTime = funding?.first_funded_time
    ? formatAge(funding.first_funded_time)
    : "--";
  const firstSig = funding?.first_funded_signature;

  return (
    <div className="flex flex-col gap-4">
      {/* First Funder Highlight Banner */}
      {firstFunder && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
              Initial Funder
            </span>
            <div className="flex items-center gap-2 font-mono text-white">
              <Avatar
                variant="square"
                className="size-8 rounded-md"
              >
                <AvatarFallback className="border border-border/40 bg-surface-2 font-bold font-sans text-white text-xs">
                  {(firstFunder || "W").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-b-2">
                {truncateString(firstFunder, 4)}
              </span>
              <CopyButton copy={firstFunder} />
              <a
                href={`https://solscan.io/account/${firstFunder}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-b-4 text-gray transition-colors hover:text-white"
              >
                Explorer ↗
              </a>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
                Initial Amount
              </span>
              <span className="font-bold text-h6 text-up">
                {firstAmount} SOL
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
                Age
              </span>
              <span className="font-medium text-b-2 text-white">
                {firstTime}
              </span>
            </div>

            {firstSig && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
                  Transaction
                </span>
                <a
                  href={`https://solscan.io/tx/${firstSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-b-3 text-gray transition-colors hover:text-white hover:underline"
                >
                  {truncateString(firstSig, 4)}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Funders Table */}
      <DataTable table={table} />
    </div>
  );
};
