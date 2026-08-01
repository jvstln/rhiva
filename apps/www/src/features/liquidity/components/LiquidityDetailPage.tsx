"use client";

import {
  CircleDollarSign,
  Coins,
  Component,
  Gift,
  Repeat,
  Wallet,
  XSquare,
} from "lucide-react";
import type { ReactNode } from "react";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { Button } from "@/components/ui/button";
import { CoinIcon } from "@/components/ui/icons";
import { LIQUIDITY_BINS } from "@/components/ui/data/liquidity-detail-data";
import { PnlExportDialog } from "@/features/portfolio/components/PnlExportDialog";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";
import { cn } from "@/lib/utils";
import { useLiquidityPool } from "../liquidity.hook";
import { QueryState } from "@/components/layout/QueryState";
import { BackButton } from "@/components/layout/BackButton";
import {
  LiquidityAddressCopy,
  LiquidityAvatar,
} from "./tooltips/LiquidityAvatar";
import { NetworkSolana } from "@web3icons/react";

export const LiquidityDetailPage = ({ id }: { id: string }) => {
  const pool = useLiquidityPool(id);

  return (
    <QueryState query={pool}>
      {(query) => {
        const p = query.data;
        const maxHeight = Math.max(...LIQUIDITY_BINS.map((b) => b.height));

        const baseSymbol = p.tokenA.symbol || p.baseSymbol || "Token A";
        const quoteSymbol = p.tokenB.symbol || "SOL";
        const pair = `${baseSymbol}/${quoteSymbol}`;

        const totalFeePct = p.totalFeePct ?? 0;
        const feeLabel =
          totalFeePct > 0 ? `${totalFeePct}%` : `${p.binStep}bps`;

        const currentPriceStr =
          p.price != null && p.price > 0 ? p.price.toExponential(4) : "N/A";

        const volume24h = p.volume ?? 0;
        const feesValue =
          p.feesUsd ?? p.fees ?? volume24h * (totalFeePct / 100);
        const activeTvl = p.activeTvl ?? 0;
        const feesRatioPct = activeTvl > 0 ? (feesValue / activeTvl) * 100 : 0;

        const tvlFormatted = formatCompactCurrency(p.tvl);
        const activeTvlFormatted = formatCompactCurrency(activeTvl);
        const feesFormatted = formatCompactCurrency(feesValue);
        const feesRatioFormatted = `${feesRatioPct.toFixed(2)}%`;

        const priceChange24h = formatSignedPercent(p.priceChange24h);
        const priceChange1h = formatSignedPercent(p.priceChange1h);

        return (
          <DashboardSlot>
            <div className="mb-6 space-y-4">
              <BackButton />

              <div className="flex items-center gap-4">
                <LiquidityAvatar liquidity={p} />

                <h1 className="flex items-center gap-2 font-bold text-xl">
                  {pair}
                  <LiquidityAddressCopy liquidity={p} />
                </h1>
                <div className="ml-2 flex items-center gap-3 border-border/70 border-l pl-4 text-gray text-sm">
                  <p>
                    Bin Step: <span className="text-white">{p.binStep}</span>
                  </p>
                  <p>
                    Fee: <span className="text-white">{feeLabel}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Liquidity Distribution */}
                <div className="mb-2">
                  <div className="mb-4 flex items-end justify-between">
                    <span className="font-semibold text-white">
                      Liquidity Distribution
                    </span>
                    <div className="text-right text-gray text-xs">
                      Current Price:{" "}
                      <span className="text-white">{currentPriceStr}</span>
                      <br />
                      {baseSymbol}
                    </div>
                  </div>

                  <div className="relative flex h-32 items-end gap-px">
                    {LIQUIDITY_BINS.map((bin) => (
                      <span
                        key={bin.bin}
                        className={cn(
                          "flex-1",
                          bin.isSol ? "bg-primary" : "bg-violet-600",
                        )}
                        style={{ height: `${(bin.height / maxHeight) * 100}%` }}
                      />
                    ))}
                    <div className="pointer-events-none absolute inset-y-0 left-[68%] flex flex-col items-center">
                      <span className="h-full w-px flex-1 bg-white" />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-white" />
                  </div>
                </div>

                {/* Current Balance */}
                <div className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-5">
                  <h3 className="font-medium text-gray text-sm">
                    Current Balance
                  </h3>
                  <div className="flex items-center justify-between gap-2 rounded-lg border bg-background/50 p-4">
                    <TokenBalanceRow
                      symbol={quoteSymbol}
                      balance={tvlFormatted}
                      usdValue={tvlFormatted}
                    />
                    <TokenBalanceRow
                      symbol={baseSymbol}
                      balance={activeTvlFormatted}
                      usdValue={activeTvlFormatted}
                    />
                  </div>
                </div>

                {/* Your Unclaimed Swap Fee */}
                <div className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-5">
                  <h3 className="font-medium text-gray text-sm">
                    Your Unclaimed Swap Fee
                  </h3>
                  <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border bg-background/50 p-4">
                    <TokenBalanceRow
                      symbol={quoteSymbol}
                      balance={feesFormatted}
                      usdValue={feesFormatted}
                    />
                    <TokenBalanceRow
                      symbol={baseSymbol}
                      balance={feesRatioFormatted}
                      usdValue={feesRatioFormatted}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Gift /> Claim Rewards
                    </Button>
                    <Button>
                      <XSquare /> Close Position
                    </Button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    label="Current pool price"
                    value={currentPriceStr}
                    meta={`${pair.replace("/", "/")} ⇄`}
                    icon={<CircleDollarSign className="size-4" />}
                  />
                  <StatCard
                    label="Total Liquidity"
                    value={tvlFormatted}
                    icon={<Wallet className="size-4" />}
                  />
                  <StatCard
                    label="Fees Earned (24h)"
                    value={feesFormatted}
                    icon={<Coins className="size-4" />}
                  />
                </div>

                {/* Position Details Panel */}
                <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card/30 p-5">
                  <div className="mb-6">
                    <p className="font-medium text-sm">{currentPriceStr} ⇋</p>
                    <p className="mt-1 text-gray text-xs">
                      {pair.replace("/", " per ")}
                    </p>
                  </div>

                  <div className="space-y-0 text-sm">
                    <DetailRow
                      label="24h Price Change"
                      value={`${priceChange24h} (${priceChange1h} 1h)`}
                      valueClass={
                        p.priceChange24h != null && p.priceChange24h >= 0
                          ? "text-up"
                          : "text-down"
                      }
                    />
                    <DetailRow label="Unclaimed Fees" value={feesFormatted} />
                    <DetailRow label="Total Liquidity" value={tvlFormatted} />
                    <DetailRow
                      label="24h Fee / TVL"
                      value={feesRatioFormatted}
                    />
                    <div className="flex items-center justify-between border-border/30 border-b py-3">
                      <span className="text-gray">Range</span>
                      <div className="flex h-2 w-24 overflow-hidden rounded-full">
                        <div className="flex-1 bg-primary" />
                        <div className="flex-1 bg-violet-600" />
                      </div>
                    </div>
                    <DetailRow
                      label="Position Status"
                      value={activeTvl > 0 ? "Active" : "Inactive"}
                      valueClass={activeTvl > 0 ? "text-up" : "text-down"}
                      noBorder
                    />
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline">
                      <Repeat /> Rebalance
                    </Button>
                    <PnlExportDialog>
                      <Button>
                        <Component /> Generate PnL
                      </Button>
                    </PnlExportDialog>
                  </div>
                </div>
              </div>
            </div>
          </DashboardSlot>
        );
      }}
    </QueryState>
  );
};

function TokenBalanceRow({
  symbol,
  balance,
  usdValue,
}: {
  symbol: string;
  balance: string;
  usdValue: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {symbol === "SOL" ? (
          <NetworkSolana className="size-5" />
        ) : (
          <CoinIcon className="size-5" />
        )}

        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-white">
            {balance} {symbol}
          </span>
          <span className="text-gray text-sm">({usdValue})</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  meta,
  icon,
}: {
  label: string;
  value: string;
  meta?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-[100px] flex-col justify-between rounded-xl border border-border/70 bg-card/30 p-4">
      <span className="text-gray text-xs">{label}</span>
      <div className="mt-2 flex items-end justify-between">
        {icon ? (
          <div className="mb-1 shrink-0 text-gray">{icon}</div>
        ) : (
          <div className="mb-1 size-4 shrink-0 rounded-sm bg-white/20" />
        )}
        <div className="text-right">
          <p className="font-bold text-sm text-white">{value}</p>
          {meta && <p className="mt-0.5 text-[10px] text-gray">{meta}</p>}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClass = "text-white",
  noBorder = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  noBorder?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3",
        !noBorder && "border-border/30 border-b",
      )}
    >
      <span className="text-gray">{label}</span>
      <span className={cn("font-medium", valueClass)}>{value}</span>
    </div>
  );
}
