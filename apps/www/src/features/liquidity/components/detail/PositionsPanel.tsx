"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";
import { QueryState } from "@/components/layout/QueryState";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { useLiquidityPositions } from "@/features/portfolio/portfolio.hook";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";

const TABS = ["Positions", "History"] as const;

export function PositionsPanel({ pool }: { pool: LiquidityPool }) {
  const auth = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Positions");

  const walletAddress = auth.authenticated
    ? (auth.activeWallet?.address ?? "")
    : "";
  const positions = useLiquidityPositions(walletAddress);

  const isOpenTab = tab === "Positions";
  const poolPositions = (positions.data?.lp_positions ?? []).filter(
    (position) => position.pool_address === pool.pool_address,
  );
  const visible = poolPositions.filter((position) =>
    isOpenTab ? position.is_open : !position.is_open,
  );

  return (
    <div className="flex-1 border-border/70 border-t">
      <div className="flex items-center gap-6 px-4 py-3">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative pb-2 font-semibold text-b-2 transition-colors",
              tab === t ? "text-white" : "text-gray hover:text-white/70",
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <QueryState
        query={positions}
        requireAuth
        getIsEmpty={() =>
          visible.length === 0 &&
          `No ${isOpenTab ? "open" : "historical"} positions in this pool`
        }
      >
        <div className="space-y-2 p-4">
          {visible.map((position) => {
            const pnlUsd =
              (position.current_value_usd ?? 0) - position.net_amount;
            const pnlPct =
              position.net_amount > 0
                ? (pnlUsd / position.net_amount) * 100
                : null;

            return (
              <div
                key={position.pool_address}
                className="space-y-2 rounded-xl border border-border/70 bg-secondary/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-b-4 text-gray">Your Liquidity</span>
                  <span className="font-medium text-b-3 text-white">
                    {formatCompactCurrency(position.deposited)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-b-4 text-gray">Claimable Fees</span>
                  {/* TODO: withdrawn reflects historical withdrawals; a live
                      unclaimed-fees value isn't returned by the LP endpoint. */}
                  <span className="font-medium text-b-3 text-white">
                    {formatCompactCurrency(position.withdrawn)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-b-4 text-gray">PnL</span>
                  <span
                    className={cn(
                      "font-medium text-b-3",
                      pnlUsd >= 0 ? "text-up" : "text-down",
                    )}
                  >
                    {`${formatCompactNumber(pnlPct, { withSign: true })}%`} (
                    {formatCompactCurrency(pnlUsd)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-b-4 text-gray">Status</span>
                  <span
                    className={cn(
                      "font-medium text-b-3",
                      position.is_open ? "text-up" : "text-gray",
                    )}
                  >
                    {position.is_open ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </QueryState>
    </div>
  );
}
