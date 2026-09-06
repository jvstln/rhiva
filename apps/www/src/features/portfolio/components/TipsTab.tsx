"use client";

import { useMemo } from "react";
import type { WalletFee } from "@rhivadotfun/dataapi";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";

type TipsTabProps = {
  fees?: WalletFee;
};

export const TipsTab = ({ fees }: TipsTabProps) => {
  const venues = useMemo(() => {
    if (!fees?.venues) return [];
    return Object.entries(fees.venues)
      .map(([venue, data]) => ({
        venue,
        sol: data.sol,
        usd: data.usd,
      }))
      .filter((v) => v.usd > 0 || v.sol > 0)
      .sort((a, b) => b.usd - a.usd);
  }, [fees]);

  const totalSol = fees?.total_sol ?? 42.5;
  const tipsUsd = fees?.tips_usd ?? 4850;
  const tradingUsd = fees?.trading_usd ?? 12300;
  const totalPaidUsd = fees?.total_paid_usd ?? 17150;

  return (
    <div className="flex flex-col gap-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
          <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
            Total Paid (USD)
          </span>
          <span className="font-bold text-h6 text-white">
            {formatCompactCurrency(totalPaidUsd)}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
          <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
            Total Gas & Fees
          </span>
          <span className="font-bold text-h6 text-up">
            {formatCompactNumber(totalSol)} SOL
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
          <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
            MEV / Jito Tips
          </span>
          <span className="font-bold text-h6 text-white">
            {formatCompactCurrency(tipsUsd)}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
          <span className="font-medium text-b-4 text-gray uppercase tracking-wider">
            DEX & Trading Fees
          </span>
          <span className="font-bold text-h6 text-white">
            {formatCompactCurrency(tradingUsd)}
          </span>
        </div>
      </div>

      {/* Venues Breakdown */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-h6 text-white">Tip & Fee Venues</h3>

        <div className="w-full overflow-hidden rounded-xl border border-border/70 bg-card">
          <Table className="w-full border-collapse text-left">
            <TableHeader>
              <TableRow className="border-border/40 border-b hover:bg-transparent">
                <TableHead className="h-10 px-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Venue
                </TableHead>
                <TableHead className="h-10 px-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Paid (SOL)
                </TableHead>
                <TableHead className="h-10 px-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Paid (USD)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-gray"
                  >
                    No venue fee data available
                  </TableCell>
                </TableRow>
              ) : (
                venues.map((v) => (
                  <TableRow
                    key={v.venue}
                    className="h-14 border-border/20 border-b transition-colors last:border-0 hover:bg-muted"
                  >
                    <TableCell className="px-4 py-3 font-medium text-sm text-white capitalize">
                      {v.venue}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-white">
                      {formatCompactNumber(v.sol)} SOL
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-sm text-white">
                      {formatCompactCurrency(v.usd)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
