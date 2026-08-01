import type { Token } from "@/features/market/market.token.type";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
} from "@/lib/finance.util";
import { cn } from "@/lib/utils";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
  TokenSymbolCopy,
} from "@/features/market/components/tooltips/TokenAvatar";
import { InfoBadge } from "@/components/ui/info-badge";
import { Separator } from "@base-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { CashbackNotice, DevHoldOrDevSell } from "./tooltips/DevInfo";
import { TotalFees } from "./tooltips/DexInfo";
import {
  TokenSocialSearch,
  TokenLatestPost,
  TokenConnection,
  TokenWebsite,
  TokenViewCount,
} from "./tooltips/Socials";
import React from "react";
import { TopHolders, TotalHolders } from "./tooltips/Holders";
import { NetworkSolana } from "@web3icons/react";
import { AddTokenToWatchlistButton } from "./TrendingView";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TokenDetailHeaderProps = { token: Token };

export function TokenDetailHeader({ token }: TokenDetailHeaderProps) {
  const headerStats = [
    {
      label: "Price",
      value: formatCompactCurrency(token.priceUsd),
    },
    {
      label: "Liq",
      value: formatCompactCurrency(token.liquidityUsd),
    },
    {
      label: "Vol",
      value: formatCompactCurrency(token.volumeUsd),
    },
    {
      label: "Total Fees",
      value: (
        <span className="flex items-center gap-1">
          <NetworkSolana className="size-4" />
          {formatCompactNumber(token.fees.totalFeeSol)}
        </span>
      ),
    },
    {
      label: "Total supply",
      value:
        token.totalSupply !== undefined
          ? formatCompactNumber(token.totalSupply)
          : "N/A",
    },
    {
      label: "B. Curve",
      value: (
        <span className={cn("text-up")}>
          {formatSignedPercent(token.bonding.bondingPct)}
        </span>
      ),
    },
    { label: "Status", value: token.live?.has_paid_order ? "Paid" : "Unpaid" },
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
              {formatDistanceToNowStrict(token.updatedAt).replace(
                /^.*?(\d+)\s*(\w).*$/,
                "$1$2",
              )}
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
          {formatCompactCurrency(token.marketCapUsd)}
        </InfoBadge>

        {headerStats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i !== 0 && <Separator orientation="vertical" />}
            <div>
              <p className="text-b-5 text-gray">{stat.label}</p>
              <p className={cn("font-semibold text-b-2 text-foreground")}>
                {stat.value}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
      <ScrollBar orientation="horizontal" showIndicator showScrollBar={false} />
    </ScrollArea>
  );
}
