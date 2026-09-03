"use client";

import { useRouter } from "next/navigation";
import type { TokenFull } from "@rhivadotfun/dataapi";

import { useSurgeTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import { Separator } from "@/components/ui/separator";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BotActivity, DexPaid, TotalFees } from "./tooltips/DexInfo";
import { DevHoldOrDevSell, DevMigratedAndLaunch } from "./tooltips/DevInfo";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
} from "@/lib/utils";
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
import { BuyAndSellButton } from "./BuyAndSellButton";

const SURGE_METRICS: Array<(props: { token: TokenFull }) => React.JSX.Element> =
  [
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
  token: TokenFull;
}

function TokenRow({ token }: TokenRowProps) {
  const router = useRouter();
  const timeframe =
    useMarketStore((state) => state.surgeFilters.timeframe) || "24h";

  const window = token.stats?.[timeframe as keyof typeof token.stats];
  const priceChangePct = window?.price_change_pct ?? 0;
  const volumeUsd = window?.volume_usd ?? 0;
  const buys = window?.buys !== undefined ? Number(window.buys) : 0;
  const sells = window?.sells ?? 0;
  const totalTransaction = buys + sells;
  const _updatedAt = token.created_time
    ? new Date(Number(token.created_time))
    : new Date();

  return (
    <article
      className="group/token-display flex cursor-pointer flex-col gap-3 border-border/70 border-b px-4 py-3 transition-colors hover:bg-surface-1/60 lg:flex-row lg:items-center lg:gap-6"
      onKeyDown={() => null}
      onClick={() => {
        router.push(`/token/${token.mint}`);
      }}
    >
      {/* Token identity */}
      <div className="flex min-w-0 flex-1 basis-3/10 gap-3 lg:max-w-100">
        <TokenAvatar token={token} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TokenNameAndSymbol token={token} />

          <div className="flex items-center gap-1.5 text-b-4 text-gray">
            <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
              {formatAge(token.created_time)}
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
        className="hidden lg:block"
      />

      {/* Market data */}
      <div className="flex min-w-0 flex-1 basis-2/4 flex-col justify-center gap-1.5 text-b-4">
        <div className="flex w-full items-center justify-between gap-1.5">
          <div className="flex w-1/2 items-center gap-2 text-base">
            <span className="text-gray">
              ATH{" "}
              <span className="font-medium text-white">
                {formatCompactCurrency(token.ath_mcap_usd)}
              </span>
            </span>

            <span className="text-up">
              {`${formatCompactNumber(priceChangePct, { withSign: true })}%`}
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
            {`${formatCompactNumber(priceChangePct, { withSign: true })}%`}
          </span>
        </div>
      </div>

      <Separator
        orientation="vertical"
        className="hidden lg:block"
      />

      {/* Activity + buy */}
      <div className="flex shrink-0 flex-col gap-1.5 text-b-4 max-lg:w-full lg:max-w-75 lg:basis-1/5 lg:items-end">
        <div className="flex items-center gap-3">
          <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
            {formatAge(token.created_time)}
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
            token={token}
          />
        ))}
      </QueryState>
    </div>
  );
}

const SurgeBuyButton = ({ token }: { token: TokenFull }) => {
  const quickBuy = useMarketStore((state) => state.surgeFilters.quickBuy) ?? 0;
  return (
    <BuyAndSellButton
      type="buy"
      token={token}
      value={quickBuy}
    />
  );
};
