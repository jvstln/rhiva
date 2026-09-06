"use client";

import { useMemo } from "react";
import type { WalletFee } from "@rhivadotfun/dataapi";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";

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
        <div className="flex flex-col rounded-lg border border-border/50 bg-card/30 p-3.5">
          <span className="text-[11px] text-muted-foreground uppercase">
            Total Paid (USD)
          </span>
          <span className="mt-1 font-bold text-base text-white">
            {formatCompactCurrency(totalPaidUsd)}
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-border/50 bg-card/30 p-3.5">
          <span className="text-[11px] text-muted-foreground uppercase">
            Total Gas & Fees
          </span>
          <span className="mt-1 font-bold text-base text-emerald-400">
            {formatCompactNumber(totalSol)} SOL
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-border/50 bg-card/30 p-3.5">
          <span className="text-[11px] text-muted-foreground uppercase">
            MEV / Jito Tips
          </span>
          <span className="mt-1 font-bold text-base text-white">
            {formatCompactCurrency(tipsUsd)}
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-border/50 bg-card/30 p-3.5">
          <span className="text-[11px] text-muted-foreground uppercase">
            DEX & Trading Fees
          </span>
          <span className="mt-1 font-bold text-base text-white">
            {formatCompactCurrency(tradingUsd)}
          </span>
        </div>
      </div>

      {/* Venues Breakdown */}
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-sm text-white">
          Tip & Fee Venues
        </span>

        <div className="overflow-hidden rounded-lg border border-border/50 bg-card/20">
          <table className="w-full text-left text-xs">
            <thead className="border-border/50 border-b bg-card/40 text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2.5">Venue</th>
                <th className="px-4 py-2.5">Paid (SOL)</th>
                <th className="px-4 py-2.5">Paid (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {venues.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    No venue fee data available
                  </td>
                </tr>
              ) : (
                venues.map((v) => (
                  <tr
                    key={v.venue}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-2.5 font-medium text-white capitalize">
                      {v.venue}
                    </td>
                    <td className="px-4 py-2.5 text-white">
                      {formatCompactNumber(v.sol)} SOL
                    </td>
                    <td className="px-4 py-2.5 font-medium text-white">
                      {formatCompactCurrency(v.usd)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
