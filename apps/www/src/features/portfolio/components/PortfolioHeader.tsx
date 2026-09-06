"use client";

import { useState } from "react";
import { Copy, ExternalLink, Radio, Wallet, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedUsd,
} from "@/lib/finance.util";
import { formatAge } from "@/lib";
import { truncateString } from "@/lib/utils";
import type { PortfolioPnl } from "../portfolio.type";

type PortfolioHeaderProps = {
  wallet: string;
  pnl?: PortfolioPnl;
  solBalance?: number;
};

export const PortfolioHeader = ({
  wallet,
  pnl,
  solBalance,
}: PortfolioHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const [isTracked, setIsTracked] = useState(false);

  const displayWallet = wallet ? truncateString(wallet, 6) : "AgmLJB...LjzN51";

  const handleCopy = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    toast.success("Wallet address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrack = () => {
    setIsTracked((prev) => !prev);
    toast.success(
      isTracked
        ? `Stopped tracking ${displayWallet}`
        : `Tracking ${displayWallet} in realtime`,
    );
  };

  const sol = solBalance ?? pnl?.summary?.total_value_sol ?? 987;
  const holdingsUsd =
    pnl?.summary?.total_value_usd ?? pnl?.total_usd ?? 104_300;
  const tokensTraded = pnl?.tokens_traded ?? 314;
  const firstTrade = pnl?.first_trade ? formatAge(pnl.first_trade) : "20h ago";

  const totalPnlUsd =
    pnl?.summary?.pnl_usd ??
    (pnl ? pnl.realized_usd + pnl.unrealized_usd : 4_340_830);
  const totalPnlPct = pnl?.roi_pct ?? pnl?.summary?.pnl_pct ?? 118.5;
  const realizedUsd = pnl?.realized_usd ?? 5_320_000;
  const unrealizedUsd = pnl?.unrealized_usd ?? -979_170;
  const investedUsd = pnl?.invested_usd ?? 3_700_000;
  const proceedsUsd = pnl?.proceeds_usd ?? 8_000_000;
  const wins = pnl?.wins ?? 219;
  const losses = pnl?.losses ?? 51;
  const buys = pnl?.buys ?? 19_000;
  const sells = pnl?.sells ?? 56_000;

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm lg:flex-row lg:items-center">
      {/* Left: Wallet Info */}
      <div className="flex items-center gap-3.5">
        <div className="flex aspect-square size-11 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
          <Wallet className="size-5.5" />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold font-mono text-base text-white tracking-tight sm:text-lg">
              {displayWallet}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                className="size-7 text-muted-foreground hover:text-white"
                title="Copy address"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
              <a
                href={`https://solscan.io/account/${wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-white"
                title="View on Solscan"
              >
                <ExternalLink className="size-3.5" />
              </a>
              <Button
                variant={isTracked ? "secondary" : "outline"}
                size="xs"
                onClick={handleTrack}
                className="ml-1 h-6 gap-1 px-2 text-xs"
              >
                <Radio
                  className={`size-3 ${isTracked ? "animate-pulse text-emerald-400" : ""}`}
                />
                <span>{isTracked ? "Tracking" : "Track"}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
            <span>
              <span className="font-semibold text-white">SOL</span>{" "}
              {formatCompactNumber(sol)}
            </span>
            <span>·</span>
            <span>
              Holdings{" "}
              <span className="font-semibold text-white">
                {formatCompactCurrency(holdingsUsd)}
              </span>
            </span>
            <span>·</span>
            <span>
              <span className="font-semibold text-white">{tokensTraded}</span>{" "}
              tokens traded
            </span>
            <span>·</span>
            <span>
              first trade{" "}
              <span className="font-medium text-white">{firstTrade}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Key PnL & Trade Metrics */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-border/40 border-t pt-3 lg:border-t-0 lg:pt-0">
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase">
            Total PnL
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm text-up sm:text-base">
              {formatSignedUsd(totalPnlUsd)}
            </span>
            <span className="font-semibold text-up text-xs">
              +{formatCompactNumber(totalPnlPct)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase">
            Realized
          </span>
          <span className="font-bold text-sm text-up sm:text-base">
            {formatSignedUsd(realizedUsd)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase">
            Unrealized
          </span>
          <span className="font-bold text-down text-sm sm:text-base">
            {formatSignedUsd(unrealizedUsd)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase">
            Invested / Proceeds
          </span>
          <span className="font-semibold text-sm text-white sm:text-base">
            {formatCompactCurrency(investedUsd)} /{" "}
            {formatCompactCurrency(proceedsUsd)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase">
            Win / Loss
          </span>
          <span className="font-bold text-sm sm:text-base">
            <span className="text-up">{wins}</span>
            <span className="text-muted-foreground"> / </span>
            <span className="text-down">{losses}</span>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground uppercase">
            Buys / Sells
          </span>
          <span className="font-bold text-sm sm:text-base">
            <span className="text-up">{formatCompactNumber(buys)}</span>
            <span className="text-muted-foreground"> / </span>
            <span className="text-down">{formatCompactNumber(sells)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
