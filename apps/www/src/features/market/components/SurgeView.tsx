"use client";
import {
  BadgeCheck,
  BikeIcon,
  Bot,
  Crosshair,
  Crown,
  FishIcon,
  HandCoins,
  Layers,
  PalmtreeIcon,
  Pencil,
  RabbitIcon,
  Search,
  Shield,
  Trophy,
  UserStar,
  Users,
  WormIcon,
  Zap,
} from "lucide-react";
import { QueryState } from "@/components/layout/QueryState";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-button";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipHeader,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Token } from "@/features/market/market.type";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
} from "@/lib/utils";
import { formatSignedPercent } from "@/lib/finance.util";
import { useSurgeTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import { TokenAvatar } from "./tooltips/TokenAvatar";

interface TokenRowProps {
  token: Token;
}

function TokenRow({ token }: TokenRowProps) {
  const timeframe = useMarketStore((state) => state.surgeFilters.timeframe);
  const priceChange = token.price_change_percent ?? 0;
  const priceIsUp = priceChange >= 0;

  const timeframeData = token.timeframes?.[timeframe];
  const uniqueWallet = timeframeData?.unique_wallet ?? 0;
  const volumeBuyUsd = timeframeData?.volume_buy_usd ?? 0;
  const volumeSellUsd = timeframeData?.volume_sell_usd ?? 0;
  const buyCount = timeframeData?.buy ?? 0;
  const sellCount = timeframeData?.sell ?? 0;
  const tradeCount = timeframeData?.trade_count ?? 0;
  const volumeUsd = timeframeData?.volume_usd ?? 0;

  return (
    <div className="flex items-center gap-6 border-border/70 border-b px-4 py-3 transition-colors hover:bg-surface-1/60">
      {/* Token identity */}
      <div className="flex min-w-0 max-w-100 flex-1 basis-3/10 gap-3">
        <TokenAvatar token={token} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">{token.name}</span>
            <span className="truncate text-muted-foreground">
              {token.symbol}
            </span>
            <InfoBadge>
              <Pencil />
            </InfoBadge>
            <InfoBadge>
              <Users className="[--accent:var(--color-warn)]" />
            </InfoBadge>
            <InfoBadge>
              <BadgeCheck className="[--accent:var(--color-info)]" />
            </InfoBadge>
          </div>

          <div className="flex items-center gap-1.5 text-b-4 text-gray">
            <span className="shrink-0 text-up">
              {formatAge(token.recent_listing_time)}
            </span>
            <Separator
              orientation="vertical"
              className="h-4/5 self-center"
            />
            <span className="truncate">
              {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
            </span>
            <CopyButton />
            <InfoBadge>
              <Search />
            </InfoBadge>
          </div>

          <ScrollArea className="">
            <div className="flex items-center gap-x-1">
              <InfoBadge
                variant="badge"
                className="[--accent:var(--color-up)]"
                tooltip={
                  <div>
                    <InfoBadgeTooltipHeader>
                      New Users ({timeframe})
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Total Unique"
                        value={formatCompactNumber(uniqueWallet)}
                      />
                      <InfoBadgeTooltipRow
                        label="New Wallets"
                        value={formatCompactNumber(
                          Math.floor(uniqueWallet * 0.2),
                        )}
                        valueClassName="text-up"
                      />
                      <InfoBadgeTooltipRow
                        label="Returning"
                        value={formatCompactNumber(
                          Math.floor(uniqueWallet * 0.8),
                        )}
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <UserStar />
                {formatCompactNumber(Math.floor(uniqueWallet * 0.2))}
              </InfoBadge>
              <InfoBadge
                variant="badge"
                className="[--accent:var(--color-info)]"
                tooltip={
                  <div>
                    <InfoBadgeTooltipHeader>
                      Dev Sell All
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Dev Wallet"
                        value={
                          <span>
                            {token.mint.slice(0, 4)}...
                            {token.mint.slice(-4)}{" "}
                          </span>
                        }
                      />
                      <InfoBadgeTooltipRow
                        label="Bought"
                        value={`${formatCompactCurrency(volumeBuyUsd * 0.05)} / ${Math.floor(buyCount * 0.1)}TXs`}
                        valueClassName="text-up"
                      />
                      <InfoBadgeTooltipRow
                        label="Sold"
                        value={`${formatCompactCurrency(volumeSellUsd * 0.08)} / ${Math.floor(sellCount * 0.1)}TXs`}
                        valueClassName="text-down"
                      />
                      <InfoBadgeTooltipRow
                        label="Balance"
                        value="$0"
                      />
                      <InfoBadgeTooltipRow
                        label="Funding"
                        value={
                          <span>
                            {token.mint.slice(4, 8)}...
                            {token.mint.slice(-8, -4)}{" "}
                          </span>
                        }
                      />
                      <InfoBadgeTooltipRow
                        label="Transfer In"
                        value={`${((token.live?.dexscreener_liquidity_usd ?? 0) % 10).toFixed(2)} SOL`}
                      />
                      <InfoBadgeTooltipRow
                        label="Time"
                        value={
                          token.recent_listing_time
                            ? new Date(
                                token.recent_listing_time * 1000,
                              ).toLocaleDateString()
                            : "N/A"
                        }
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Shield />
                DS
              </InfoBadge>

              <InfoBadge
                variant="badge"
                className="[--accent:var(--color-warn)]"
                tooltip={
                  <InfoBadgeTooltipRow
                    label="Insiders hold"
                    value="8.04%"
                  />
                }
              >
                <RabbitIcon /> 8.04%
              </InfoBadge>

              <InfoBadge
                variant="badge"
                className="[--accent:var(--color-warn)]"
                tooltip={
                  <div>
                    <InfoBadgeTooltipHeader>
                      Top 10 Holders
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Total Supply Held"
                        value={`${(30 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 15)).toFixed(1)}%`}
                        valueClassName="text-warn"
                      />
                      <InfoBadgeTooltipRow
                        label="Creator Balance"
                        value={`${((token.live?.dexscreener_liquidity_usd ?? 0) % 3).toFixed(1)}%`}
                      />
                      <InfoBadgeTooltipRow
                        label="Largest Wallet"
                        value={`${(3 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 4)).toFixed(1)}%`}
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Users />
                {(
                  30 +
                  ((token.live?.dexscreener_liquidity_usd ?? 0) % 15)
                ).toFixed(1)}
                %
              </InfoBadge>
              <InfoBadge
                variant="badge"
                className="[--accent:var(--color-up)]"
                tooltip={
                  <div>
                    <InfoBadgeTooltipHeader>
                      Bundler Info
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Bundlers hold"
                        value={`${(20 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 3) + 0.55).toFixed(2)}%`}
                      />
                      <InfoBadgeTooltipRow
                        label="ATH hold"
                        value={`${(90 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 11)).toFixed(0)}%`}
                      />
                      <InfoBadgeTooltipRow
                        label="Total bundlers"
                        value={`${Math.floor(250 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 95))}`}
                      />
                      <InfoBadgeTooltipRow
                        label="Bundled total"
                        value={`${(1000 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 150) + 0.75).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      />
                      <InfoBadgeTooltipRow
                        label="Bundled token"
                        value={`${(160 + ((token.live?.dexscreener_liquidity_usd ?? 0) % 15) + 0.8).toFixed(1)}%`}
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Layers />
                {(
                  20 +
                  ((token.live?.dexscreener_liquidity_usd ?? 0) % 3) +
                  0.55
                ).toFixed(2)}
                %
              </InfoBadge>
              <InfoBadge
                variant={"badge"}
                tooltip={
                  <InfoBadgeTooltipRow
                    label="Phishing hold"
                    value="5%"
                  />
                }
                className="[--accent:var(--color-down)]"
              >
                <FishIcon /> 5%
              </InfoBadge>
              <InfoBadge
                variant={"badge"}
                tooltip={
                  <InfoBadgeTooltipRow
                    label="Vanish hold"
                    value="5%"
                  />
                }
                className="[--accent:var(--color-up)]"
              >
                <WormIcon /> 5%
              </InfoBadge>
              <InfoBadge
                variant={"badge"}
                tooltip={
                  <InfoBadgeTooltipRow
                    label="Fresh hold"
                    value="5%"
                  />
                }
                className="[--accent:var(--color-up)]"
              >
                <PalmtreeIcon /> 5%
              </InfoBadge>
              <InfoBadge
                variant="badge"
                className="[--accent:var(--color-down)]"
                tooltip={
                  <div>
                    <InfoBadgeTooltipHeader>
                      Sniper Activity
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Total Snipers"
                        value={Math.floor(tradeCount * 0.02)}
                      />
                      <InfoBadgeTooltipRow
                        label="Snipers Holding"
                        value={Math.floor(tradeCount * 0.005)}
                        valueClassName="text-down"
                      />
                      <InfoBadgeTooltipRow
                        label="Snipers Sold"
                        value={Math.floor(tradeCount * 0.015)}
                      />
                      <InfoBadgeTooltipRow
                        label="Avg Profit"
                        value={`+${(volumeUsd % 5).toFixed(1)} SOL`}
                        valueClassName="text-up"
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Crosshair />
                {Math.floor(tradeCount * 0.02)}
              </InfoBadge>
              <InfoBadge
                variant={"badge"}
                tooltip={
                  <InfoBadgeTooltipRow
                    label="Rugged hold"
                    value="5%"
                  />
                }
                className="[--accent:var(--color-down)]"
              >
                <BikeIcon /> 5%
              </InfoBadge>
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
                {formatCompactCurrency(
                  (token.live?.dexscreener_market_cap_usd ?? 0) * 1.35,
                )}
              </span>
            </span>

            <span className="text-up">
              {formatSignedPercent(token.last_surge_pct ?? token.price_change_percent ?? timeframeData?.price_change_percent ?? 0, 1)}
            </span>
          </div>

          <div className="w-1/2" />
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            MC{" "}
            <span className="w-16 font-medium text-info text-lg">
              {formatCompactCurrency(token.live?.dexscreener_market_cap_usd)}
            </span>
          </span>

          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, var(--color-foreground))`,
            }}
          />
          <span className="text-right font-semibold text-2xl text-white">
            {formatCompactCurrency(token.live?.dexscreener_liquidity_usd)}
          </span>
          <span
            className={cn(
              "ml-auto text-right text-base",
              priceIsUp ? "text-up" : "text-down",
            )}
          >
            {priceChange > 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
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
          <span className="text-up">
            {formatAge(token.recent_listing_time)}
          </span>
          <SurgeBuyButton />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-x-1 **:data-[slot=info-badge]:text-sm">
          <InfoBadge tooltip="Bonding Curve Progress">
            <Trophy />
            {(token.bonding?.completion_pct ?? 0).toFixed(0)}
          </InfoBadge>
          <InfoBadge
            className="[--accent:var(--color-warn)]"
            tooltip={
              <div>
                <InfoBadgeTooltipRow
                  label="Dev Migrated"
                  value="1"
                />
                <InfoBadgeTooltipRow
                  label="Dev Launched"
                  value="1"
                />
                <InfoBadgeTooltipRow
                  label="Migrated"
                  value="100%"
                />
              </div>
            }
          >
            <Crown />
            8/297
          </InfoBadge>
          <InfoBadge tooltip="Total Holders">
            <Users />
            {formatCompactNumber(token.holders?.holder_count)}
          </InfoBadge>
          <InfoBadge tooltip="85 wallets that used Axiom, Padre, Photon etc., and current holding 0%">
            <Bot />
            {formatCompactNumber(uniqueWallet)}
          </InfoBadge>
          <InfoBadge
            className="[--accent:var(--color-warn)]"
            tooltip="Prio & Tip & Trading Fees 23.10 SOL"
          >
            <HandCoins />
            {(token.global_fees_paid ?? 0).toFixed(2)}
          </InfoBadge>
          <InfoBadge tooltip={`Trades (${timeframe})`}>
            TX {formatCompactNumber(tradeCount)}
          </InfoBadge>
        </div>

        <Separator
          className="w-1/4! grow-0"
          orientation="horizontal"
        />

        <div className="w-full text-right text-b-5 text-gray">
          V {formatCompactCurrency(volumeUsd)}
        </div>
      </div>
    </div>
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
        {query.data?.tokens?.map((token) => (
          <TokenRow
            key={token.mint}
            token={token}
          />
        ))}
      </QueryState>
    </div>
  );
}

const SurgeBuyButton = () => {
  const quickBuy = useMarketStore((state) => state.surgeFilters.quickBuy) ?? 0;

  return (
    quickBuy !== null && (
      <Button
        size="sm"
        variant={"soft"}
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
