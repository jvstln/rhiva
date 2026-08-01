"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CircleDollarSign,
  Coins,
  Component,
  Gift,
  Repeat,
  Wallet,
  XSquare,
} from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { useLiquidityPool } from "../liquidity.hook";
import { QueryState } from "@/components/layout/QueryState";
import { DashboardSlot } from "@/components/layout/DashboardUi";
import { Button, buttonVariants } from "@/components/ui/button";
import { CoinIcon, MeteoraIcon, SolanaIcon } from "@/components/ui/icons";
import { LIQUIDITY_BINS } from "@/components/ui/data/liquidity-detail-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";
import { PnlExportDialog } from "@/features/portfolio/components/PnlExportDialog";

export const LiquidityDetailPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const pool = useLiquidityPool(id);

  return (
    <QueryState query={pool}>
      {(query) => {
        const p = query.data;
        const maxHeight = Math.max(...LIQUIDITY_BINS.map((b) => b.height));
        const currentPriceNum = p.sqrt_price ? Number(p.sqrt_price) ** 2 : 0;
        const currentPriceStr =
          currentPriceNum > 0 ? currentPriceNum.toExponential(4) : "N/A";

        const symbolA = p.token_a?.symbol ?? p.token_mint_a.slice(0, 6);
        const symbolB = p.token_b?.symbol ?? p.token_mint_b.slice(0, 6);
        const pair = `${symbolA}/${symbolB}`;

        const baseToken =
          p.token_mint_a === p.base_mint ? p.token_a : p.token_b;
        const logoUri =
          baseToken?.logo_uri ??
          p.token_a?.logo_uri ??
          p.token_b?.logo_uri ??
          "";

        const totalFeePct = Number(
          p.total_fee_pct ?? p.base_fee_pct ?? p.dynamic_fee_pct ?? 0,
        );
        const feeLabel =
          totalFeePct > 0 ? `${totalFeePct.toFixed(2)}%` : `${p.bin_step}%`;

        const activeTvlNum = (p as any).active_tvl_usd ?? p.tvl_usd ?? 0;
        const volume24h = p.volume_24h_usd ?? 0;
        const feesValue =
          (p as any).fees_usd ?? volume24h * (totalFeePct / 100);

        const tvlStr = formatCompactCurrency(p.tvl_usd);
        const activeTvlStr = formatCompactCurrency(activeTvlNum);
        const volumeStr = formatCompactCurrency(volume24h);
        const feesStr = formatCompactCurrency(feesValue);
        const feesChangeStr = formatSignedPercent(
          (p as any).fees_change_pct ?? null,
        );
        const feesRatioStr =
          activeTvlNum > 0
            ? `${((feesValue / activeTvlNum) * 100).toFixed(2)}%`
            : "N/A";
        const feesRatioChangeStr = formatSignedPercent(
          (p as any).fees_ratio_change_pct ?? null,
        );
        const marketCapChangeStr = formatSignedPercent(p.price_change_24h_pct);

        return (
          <DashboardSlot>
            {/* HEADER */}
            <div className="mb-6 space-y-4">
              <Button
                onClick={() => router.back()}
                className={cn(buttonVariants({ variant: "ghost" }))}
                variant={"ghost"}
              >
                <ChevronLeft />
                Back
              </Button>

              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={logoUri} />
                  <AvatarFallback>{getInitials(pair)}</AvatarFallback>
                </Avatar>
                <h1 className="flex items-center gap-2 font-bold text-xl">
                  {pair}
                  <MeteoraIcon className="size-4" />
                </h1>
                <div className="ml-2 flex items-center gap-3 border-border/70 border-l pl-4 text-gray text-sm">
                  <p>
                    Bin Step: <span className="text-white">{p.bin_step}</span>
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
                      {pair.replace("/", " per ")}
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
                      symbol={p.token_b?.symbol ?? "Token A"}
                      balance={tvlStr}
                      usdValue={activeTvlStr}
                    />
                    <TokenBalanceRow
                      symbol={p.token_a?.symbol ?? "Token B"}
                      balance={volumeStr}
                      usdValue={volumeStr}
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
                      symbol={p.token_b?.symbol ?? "Token A"}
                      balance={feesStr}
                      usdValue={feesChangeStr}
                    />
                    <TokenBalanceRow
                      symbol={p.token_a?.symbol ?? "Token B"}
                      balance={feesRatioStr}
                      usdValue={feesRatioChangeStr}
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
                    value={tvlStr}
                    icon={<Wallet className="size-4" />}
                  />
                  <StatCard
                    label="Fees Earned (Claimed)"
                    value={feesStr}
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
                      label="PnL"
                      value={`${marketCapChangeStr} (${marketCapChangeStr})`}
                      valueClass="text-up"
                    />
                    <DetailRow
                      label="Unclaimed Fees"
                      value={feesStr}
                    />
                    <DetailRow
                      label="Total Liquidity"
                      value={tvlStr}
                    />
                    <DetailRow
                      label="24h Fee / TVL"
                      value={feesRatioStr}
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
                      value={activeTvlNum ? "Active" : "Inactive"}
                      valueClass={activeTvlNum ? "text-up" : "text-down"}
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
          <SolanaIcon className="size-5" />
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
