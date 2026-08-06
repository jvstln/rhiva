"use client";

import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import type { TokenDetail } from "@rhivadotfun/dataapi";

import { Button } from "@/components/ui/button";
import { useSurgeTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import { Separator } from "@/components/ui/separator";
import { formatSignedPercent } from "@/lib/finance.util";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BotActivity, DexPaid, TotalFees } from "./tooltips/DexInfo";
import { DevHoldOrDevSell, DevMigratedAndLaunch } from "./tooltips/DevInfo";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import {
  TokenConnection,
  TokenLatestPost,
  TokenSocialSearch,
} from "./tooltips/Socials";
import {
  InfoBadge,
  InfoBadgeTooltipRow,
  InfoBadgeTooltipGrid,
} from "@/components/ui/info-badge";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
  TokenSymbolCopy,
} from "./tooltips/TokenAvatar";
import {
  KolHold,
  FreshHold,
  TopHolders,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  SnipersHold,
  TotalHolders,
} from "./tooltips/Holders";
import { toast } from "sonner";
import { useSwap } from "@/features/transaction/hooks/use-swap";

const SURGE_METRICS: Array<
  (props: { token: TokenDetail }) => React.JSX.Element
> = [
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
  token: TokenDetail;
}

function TokenRow({ token }: TokenRowProps) {
  const router = useRouter();
  const timeframe =
    useMarketStore((state) => state.surgeFilters.timeframe) || "24h";

  const window = token.timeframes?.windows?.[timeframe];
  const priceChangePct =
    window?.price_change_pct ?? token.price_change_percent ?? 0;
  const volumeUsd = window?.volume_usd ?? 0;
  const buys = window?.buys !== undefined ? Number(window.buys) : 0;
  const sells = window?.sells ?? 0;
  const totalTransaction = buys + sells;
  const updatedAt = token.live?.updated_at
    ? new Date(Number(token.live.updated_at))
    : new Date();

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
              {token.live?.updated_at
                ? formatDistanceToNowStrict(updatedAt).replace(
                    /^.*?(\d+)\s*(\w).*$/,
                    "$1$2",
                  )
                : "N/A"}
            </InfoBadge>
            <Separator
              orientation="vertical"
              className="h-4/5 self-center"
            />
            <TokenSymbolCopy token={token} />
            <Separator
              orientation="vertical"
              className="h-4/5 self-center"
            />
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

      <Separator
        orientation="vertical"
        className=""
      />

      {/* Market data */}
      <div className="flex min-w-0 flex-1 basis-2/4 flex-col justify-center gap-1.5 text-b-4">
        <div className="flex w-full items-center justify-between gap-1.5">
          <div className="flex w-1/2 items-center gap-2 text-base">
            <span className="text-gray">
              ATH{" "}
              <span className="font-medium text-white">
                {formatCompactCurrency(token.all_time_high_market_cap_usd)}
              </span>
            </span>

            <span className="text-up">
              {formatSignedPercent(token.price_change_percent)}
            </span>
          </div>

          <div className="w-1/2" />
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            MC{" "}
            <span className="w-16 font-medium text-info text-lg">
              {formatCompactCurrency(token.market_cap_usd)}
            </span>
          </span>

          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, var(--color-foreground))`,
            }}
          />
          <span className="text-right font-semibold text-2xl text-white">
            {formatCompactCurrency(token.liquidity_usd)}
          </span>
          <span
            className={cn(
              "ml-auto text-right text-base",
              priceChangePct > 0 ? "text-up" : "text-down",
            )}
          >
            {priceChangePct > 0 ? "+" : ""}
            {priceChangePct.toFixed(2)}%
          </span>
        </div>
      </div>

      <Separator
        orientation="vertical"
        className=""
      />

      {/* Activity + buy */}
      <div className="flex max-w-75 shrink-0 basis-1/5 flex-col items-end gap-1.5 text-b-4">
        <div className="flex items-center gap-3">
          <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
            {token.live?.updated_at
              ? formatDistanceToNowStrict(updatedAt).replace(
                  /^.*?(\d+)\s*(\w).*$/,
                  "$1$2",
                )
              : "N/A"}
          </InfoBadge>
          <SurgeBuyButton token={token} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-x-1 **:data-[slot=info-badge]:text-sm">
          <KolHold token={token} />
          <DevMigratedAndLaunch token={token} />
          <TotalHolders token={token} />
          <BotActivity token={token} />
          <TotalFees token={token} />

          <InfoBadge
            tooltip={
              <InfoBadgeTooltipGrid>
                <InfoBadgeTooltipRow
                  label={`${sells + buys} TXs`}
                  value={`${formatCompactNumber(totalTransaction)}`}
                />
                <InfoBadgeTooltipRow
                  label={`${timeframe} Buys`}
                  value={
                    <span className="text-up">{formatCompactNumber(buys)}</span>
                  }
                />
                <InfoBadgeTooltipRow
                  label={`${timeframe} Sells`}
                  value={
                    <span className="text-down">
                      {formatCompactNumber(sells)}
                    </span>
                  }
                />
              </InfoBadgeTooltipGrid>
            }
          >
            TX {formatCompactNumber(totalTransaction)}
          </InfoBadge>
        </div>

        <Separator
          className="relative w-1/4! grow-0 bg-down before:absolute before:inset-y-0 before:left-0 before:w-(--) before:bg-up"
          orientation="horizontal"
          style={
            {
              "--buy-percent": `${totalTransaction > 0 ? (buys / totalTransaction) * 100 : 0}%`,
            } as React.CSSProperties
          }
        />

        <div className="w-full text-right text-b-5 text-gray">
          V {formatCompactCurrency(volumeUsd)}
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
      <QueryState
        query={query}
        getIsLoading={(q) => q.isPending}
      >
        {query.data?.map((token) => (
          <TokenRow
            key={token.mint}
            token={token as unknown as TokenDetail}
          />
        ))}
      </QueryState>
    </div>
  );
}

const SurgeBuyButton = ({ token }: { token: TokenDetail }) => {
  const quickBuy = useMarketStore((state) => state.surgeFilters.quickBuy) ?? 0;
  const swap = useSwap();

  return (
    quickBuy !== null && (
      <Button
        size="sm"
        variant={"soft"}
        data-require-auth
        loading={swap.isPending}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (quickBuy <= 0) {
            return toast.error("Quick buy amount must be greater than zero");
          }

          swap.mutate({
            action: "buy",
            outputMint: token.mint,
            amount: quickBuy,
          });
        }}
      >
        <Zap
          className="size-3"
          fill="currentColor"
        />

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
