"use client";
import { Zap } from "lucide-react";
import { QueryState } from "@/components/layout/QueryState";
import { Button } from "@/components/ui/button";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Token } from "@/features/market/market.type";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import { formatSignedPercent } from "@/lib/finance.util";
import { useSurgeTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
  TokenSymbolCopy,
} from "./tooltips/TokenAvatar";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import {
  TokenConnection,
  TokenLatestPost,
  TokenSocialSearch,
} from "./tooltips/Socials";
import { DevHoldOrDevSell, DevMigratedAndLaunch } from "./tooltips/DevInfo";
import { BotSummary, DexPaid, GlobalFees } from "./tooltips/DexInfo";
import {
  TopHolders,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  FreshHold,
  SnipersHold,
  TotalHolders,
  KolHold,
} from "./tooltips/Holders";

const SURGE_METRICS: Array<(props: { token: Token }) => React.JSX.Element> = [
  TopHolders,
  DevHoldOrDevSell,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  FreshHold,
  SnipersHold,
  DexPaid,
];

interface TokenRowProps {
  token: Token;
}

function TokenRow({ token }: TokenRowProps) {
  const router = useRouter();

  return (
    <article
      className="group/token-display flex cursor-pointer items-center gap-6 border-border/70 border-b px-4 py-3 transition-colors hover:bg-surface-1/60"
      onKeyDown={() => null}
      onClick={() => {
        router.push(`/token/${token.mint}`);
      }}
    >
      {/* Token identity */}
      <div className="flex min-w-0 max-w-100 flex-1 basis-3/10 gap-3">
        <TokenAvatar token={token} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TokenNameAndSymbol token={token} />

          <div className="flex items-center gap-1.5 text-b-4 text-gray">
            <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
              {formatDistanceToNowStrict(token.updatedAt).replace(
                /^.*?(\d+)\s*(\w).*$/,
                "$1$2",
              )}
            </InfoBadge>
            <Separator orientation="vertical" className="h-4/5 self-center" />
            <TokenSymbolCopy token={token} />
            <Separator orientation="vertical" className="h-4/5 self-center" />
            <TokenLatestPost token={token} />
            <TokenConnection token={token} />
            <TokenDescription token={token} />
            <TokenSocialSearch token={token} />
          </div>

          <ScrollArea className="">
            <div className="flex gap-1">
              {SURGE_METRICS.map((Metric, i) => (
                <Metric
                  // biome-ignore lint/suspicious/noArrayIndexKey: metrics order won
                  key={i}
                  token={token}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <Separator orientation="vertical" className="" />

      {/* Market data */}
      <div className="flex min-w-0 flex-1 basis-2/4 flex-col justify-center gap-1.5 text-b-4">
        <div className="flex w-full items-center justify-between gap-1.5">
          <div className="flex w-1/2 items-center gap-2 text-base">
            <span className="text-gray">
              ATH{" "}
              <span className="font-medium text-white">
                {formatCompactCurrency(token.athUsd)}
              </span>
            </span>

            <span className="text-up">
              {formatSignedPercent(token.priceChangePercent, 1)}
            </span>
          </div>

          <div className="w-1/2" />
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            MC{" "}
            <span className="w-16 font-medium text-info text-lg">
              {formatCompactCurrency(token.marketCapUsd)}
            </span>
          </span>

          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, var(--color-foreground))`,
            }}
          />
          <span className="text-right font-semibold text-2xl text-white">
            {formatCompactCurrency(token.liquidityUsd)}
          </span>
          <span
            className={cn(
              "ml-auto text-right text-base",
              token.priceChangePercent > 0 ? "text-up" : "text-down",
            )}
          >
            {token.priceChangePercent > 0 ? "+" : ""}
            {token.priceChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <Separator orientation="vertical" className="" />

      {/* Activity + buy */}
      <div className="flex max-w-75 shrink-0 basis-1/5 flex-col items-end gap-1.5 text-b-4">
        <div className="flex items-center gap-3">
          <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
            {formatDistanceToNowStrict(token.updatedAt).replace(
              /^.*?(\d+)\s*(\w).*$/,
              "$1$2",
            )}
          </InfoBadge>
          <SurgeBuyButton />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-x-1 **:data-[slot=info-badge]:text-sm">
          <KolHold token={token} />
          <DevMigratedAndLaunch token={token} />
          <TotalHolders token={token} />
          <BotSummary token={token} />
          <GlobalFees token={token} />

          <InfoBadge
            tooltip={
              <InfoBadgeTooltipGrid>
                <InfoBadgeTooltipRow
                  label={`${token.timeframe} TXs`}
                  value={`${formatCompactNumber(token.totalTransaction)}`}
                />
                <InfoBadgeTooltipRow
                  label={`${token.timeframe} Buys`}
                  value={
                    <span className="text-up">
                      {formatCompactNumber(token.buys)}
                    </span>
                  }
                />
                <InfoBadgeTooltipRow
                  label={`${token.timeframe} Sells`}
                  value={
                    <span className="text-down">
                      {formatCompactNumber(token.sells)}
                    </span>
                  }
                />
              </InfoBadgeTooltipGrid>
            }
          >
            TX {formatCompactNumber(token.totalTransaction)}
          </InfoBadge>
        </div>

        <Separator className="w-1/4! grow-0" orientation="horizontal" />

        <div className="w-full text-right text-b-5 text-gray">
          V {formatCompactCurrency(token.volumeUsd)}
        </div>
      </div>
    </article>
  );
}

export function SurgeTable() {
  const filters = useMarketStore((state) => state.surgeFilters);
  const query = useSurgeTokens(filters);

  return (
    <div className="w-full">
      <QueryState query={query} getIsLoading={(q) => q.isPending}>
        {query.data?.tokens?.map((token) => (
          <TokenRow key={token.mint} token={token} />
        ))}
      </QueryState>
    </div>
  );
}

const SurgeBuyButton = () => {
  const quickBuy = useMarketStore((state) => state.surgeFilters.quickBuy) ?? 0;

  return (
    quickBuy !== null && (
      <Button size="sm" variant={"soft"}>
        <Zap className="size-3" fill="currentColor" />

        <span className={cn(quickBuy > 0 && "group-hover/button:hidden")}>
          Buy
        </span>

        {quickBuy && (
          <span
            className={cn(quickBuy > 0 && "hidden group-hover/button:inline")}
          >
            {quickBuy} SOL
          </span>
        )}
      </Button>
    )
  );
};
