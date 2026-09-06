"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { WalletFunding } from "@rhivadotfun/dataapi";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { CopyButton } from "@/components/ui/button";
import { formatCompactNumber } from "@/lib/finance.util";
import { formatAge } from "@/lib";
import { truncateString } from "@/lib/utils";

type FunderItem = WalletFunding["funders"][number];

const columnHelper = createColumnHelper<FunderItem>();

const columns = [
  columnHelper.accessor("wallet", {
    header: "Funder Address",
    cell: ({ getValue }) => {
      const w = getValue();
      const initial = (w || "W").slice(0, 1).toUpperCase();
      return (
        <span className="flex items-center gap-2 font-mono text-white text-xs">
          <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 font-bold font-sans text-[10px] text-muted-foreground">
            {initial}
          </div>
          <span>{truncateString(w, 4)}</span>
          <CopyButton copy={w} />
        </span>
      );
    },
    size: 260,
  }),
  columnHelper.accessor("total", {
    header: "Total Funded (SOL)",
    cell: ({ getValue }) => (
      <span className="font-semibold text-emerald-400 text-xs">
        {formatCompactNumber(getValue())} SOL
      </span>
    ),
    size: 160,
  }),
  columnHelper.accessor("transfers", {
    header: "Transfers",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground text-xs">{getValue()} txs</span>
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
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/50 bg-card/30 p-4 text-xs">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[11px] text-muted-foreground uppercase">
              Initial Funder
            </span>
            <div className="flex items-center gap-2 font-mono text-white">
              <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 font-bold font-sans text-[10px] text-muted-foreground">
                {(firstFunder || "W").slice(0, 1).toUpperCase()}
              </div>
              <span className="font-medium text-sm">
                {truncateString(firstFunder, 4)}
              </span>
              <CopyButton copy={firstFunder} />
              <a
                href={`https://solscan.io/account/${firstFunder}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-xs hover:text-white"
              >
                Explorer ↗
              </a>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[11px] text-muted-foreground uppercase">
                Initial Amount
              </span>
              <span className="font-bold text-emerald-400 text-sm">
                {firstAmount} SOL
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-muted-foreground uppercase">
                Age
              </span>
              <span className="font-medium text-white">{firstTime}</span>
            </div>

            {firstSig && (
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground uppercase">
                  Transaction
                </span>
                <a
                  href={`https://solscan.io/tx/${firstSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-muted-foreground hover:text-white hover:underline"
                >
                  {truncateString(firstSig, 4)}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Funders Table */}
      <DataTable
        table={table}
        variant="compact"
      />
    </div>
  );
};
