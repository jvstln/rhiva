import React from "react";
import { Separator } from "@base-ui/react";
import { NetworkSolana } from "@web3icons/react";
import type { TokenDetail } from "@rhivadotfun/dataapi";

import { cn, formatAge } from "@/lib/utils";
import { TotalFees } from "./tooltips/DexInfo";
import { AddTokenToWatchlistButton } from "./TrendingView";
import { InfoBadge } from "@/components/ui/info-badge";
import { TopHolders, TotalHolders } from "./tooltips/Holders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CashbackNotice, DevHoldOrDevSell } from "./tooltips/DevInfo";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import {
  TokenSocialSearch,
  TokenLatestPost,
  TokenConnection,
  TokenWebsite,
  TokenViewCount,
} from "./tooltips/Socials";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
  TokenSymbolCopy,
} from "@/features/market/components/tooltips/TokenAvatar";

type TokenDetailHeaderProps = { token: TokenDetail };

export function TokenDetailHeader({ token }: TokenDetailHeaderProps) {
  const window24h =
    token.timeframes?.windows?.["24h"] ??
    token.timeframes?.windows?.["1h"] ??
    Object.values(token.timeframes?.windows ?? {})[0];
  const volumeUsd = window24h?.volume_usd ?? 0;
  const bondingPct = token.bonding?.completion_pct ?? 0;
  const _updatedAt = token.live?.updated_at
    ? new Date(Number(token.live.updated_at))
    : new Date();

  const totalSupply =
    token.price_usd && token.market_cap_usd
      ? token.market_cap_usd / token.price_usd
      : 0;

  const headerStats = [
    {
      label: "Price",
      value: formatCompactCurrency(token.price_usd),
    },
    {
      label: "Liq",
      value: formatCompactCurrency(token.liquidity_usd),
    },
    {
      label: "Vol",
      value: formatCompactCurrency(volumeUsd),
    },
    {
      label: "Total Fees",
      value: (
        <span className="flex items-center gap-1">
          <NetworkSolana className="size-4" />
          {formatCompactNumber(token.global_fees_paid)}
        </span>
      ),
    },
    {
      label: "Total supply",
      value: formatCompactNumber(totalSupply),
    },
    {
      label: "B. Curve",
      value: (
        <span className={cn("text-up")}>
          {`${formatCompactNumber(bondingPct, { withSign: true })}%`}
        </span>
      ),
    },
    {
      label: "Status",
      value: token.social?.has_paid_order ? "Paid" : "Unpaid",
    },
  ];

  return (
    <ScrollArea className={"w-full min-w-0"}>
      <div className="flex w-max items-center gap-3 border-border/70 border-b px-4 pt-1 pb-3">
        <div className="flex items-center gap-1">
          <AddTokenToWatchlistButton mint={token.mint} />
          <TokenAvatar token={token} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 **:[[data-slot=token-name],[data-slot=token-symbol]]:text-base">
            <TokenNameAndSymbol token={token} />
            <CashbackNotice token={token} />
            <TokenDescription token={token} />
            <TokenSocialSearch token={token} />
          </div>
          <div className="flex items-baseline gap-1">
            <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
              {formatAge(token.live?.updated_at)}
            </InfoBadge>
            <TokenSymbolCopy token={token} />
            <TokenLatestPost token={token} />
            <TokenConnection token={token} />
            <TokenWebsite token={token} />
            <TotalFees token={token} />
            <DevHoldOrDevSell token={token} />
            <TotalHolders token={token} />
            <TopHolders token={token} />
            <TokenViewCount token={token} />
          </div>
        </div>

        <InfoBadge
          className="mx-4 font-bold text-foreground text-h5"
          tooltip="Market cap"
        >
          {formatCompactCurrency(token.market_cap_usd)}
        </InfoBadge>

        <div className="flex items-center gap-5">
          {headerStats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i !== 0 && <Separator orientation="vertical" />}
              <div>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
                <p className={cn("font-semibold text-foreground text-lg")}>
                  {stat.value}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <ScrollBar
        orientation="horizontal"
        showIndicator
        showScrollBar={false}
      />
    </ScrollArea>
  );
}
