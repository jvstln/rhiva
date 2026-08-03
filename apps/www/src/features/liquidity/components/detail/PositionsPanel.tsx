"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { useLiquidityPositions } from "@/features/portfolio/portfolio.hook";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";

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

      {!auth.authenticated ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-gray">
            <MapPin className="size-6" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-b-1 text-white">
              No Wallet Connected
            </p>
            <p className="mt-1 text-b-3 text-gray">
              Connect your wallet to view your open positions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button data-require-auth>Connect Wallet</Button>
            <Button variant="secondary">Learn about DLMM</Button>
          </div>
        </div>
      ) : positions.isPending ? (
        <div className="grid place-items-center py-24 text-b-3 text-gray">
          Loading positions...
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-gray">
            <MapPin className="size-6" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-b-1 text-white">
              No {isOpenTab ? "open" : "historical"} positions in this pool
            </p>
          </div>
        </div>
      ) : (
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
                    {formatSignedPercent(pnlPct)} (
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
      )}
    </div>
  );
}
