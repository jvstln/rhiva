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
import type { MemeToken } from "@/features/market/market.type";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
} from "@/lib/utils";
import { useSurgeTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import { TokenAvatar } from "./tooltips/TokenAvatar";

interface TokenRowProps {
  token: MemeToken;
}

function TokenRow({ token }: TokenRowProps) {
  const priceChange = token.price_change_24h_percent ?? 0;
  const priceIsUp = priceChange >= 0;

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
              {token.address.slice(0, 4)}...{token.address.slice(-4)}
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
                      New Users (24h)
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Total Unique"
                        value={formatCompactNumber(token.unique_wallet_24h)}
                      />
                      <InfoBadgeTooltipRow
                        label="New Wallets"
                        value={formatCompactNumber(
                          Math.floor(token.unique_wallet_24h * 0.2),
                        )}
                        valueClassName="text-up"
                      />
                      <InfoBadgeTooltipRow
                        label="Returning"
                        value={formatCompactNumber(
                          Math.floor(token.unique_wallet_24h * 0.8),
                        )}
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <UserStar />
                {formatCompactNumber(Math.floor(token.unique_wallet_24h * 0.2))}
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
                            {token.address.slice(0, 4)}...
                            {token.address.slice(-4)}{" "}
                          </span>
                        }
                      />
                      <InfoBadgeTooltipRow
                        label="Bought"
                        value={`${formatCompactCurrency(token.volume_buy_24h_usd * 0.05)} / ${Math.floor(token.buy_24h * 0.1)}TXs`}
                        valueClassName="text-up"
                      />
                      <InfoBadgeTooltipRow
                        label="Sold"
                        value={`${formatCompactCurrency(token.volume_sell_24h_usd * 0.08)} / ${Math.floor(token.sell_24h * 0.1)}TXs`}
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
                            {token.address.slice(4, 8)}...
                            {token.address.slice(-8, -4)}{" "}
                          </span>
                        }
                      />
                      <InfoBadgeTooltipRow
                        label="Transfer In"
                        value={`${(token.liquidity % 10).toFixed(2)} SOL`}
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
                        value={`${(30 + (token.liquidity % 15)).toFixed(1)}%`}
                        valueClassName="text-warn"
                      />
                      <InfoBadgeTooltipRow
                        label="Creator Balance"
                        value={`${(token.liquidity % 3).toFixed(1)}%`}
                      />
                      <InfoBadgeTooltipRow
                        label="Largest Wallet"
                        value={`${(3 + (token.liquidity % 4)).toFixed(1)}%`}
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Users />
                {(30 + (token.liquidity % 15)).toFixed(1)}%
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
                        value={`${(20 + (token.liquidity % 3) + 0.55).toFixed(2)}%`}
                      />
                      <InfoBadgeTooltipRow
                        label="ATH hold"
                        value={`${(90 + (token.liquidity % 11)).toFixed(0)}%`}
                      />
                      <InfoBadgeTooltipRow
                        label="Total bundlers"
                        value={`${Math.floor(250 + (token.liquidity % 95))}`}
                      />
                      <InfoBadgeTooltipRow
                        label="Bundled total"
                        value={`${(1000 + (token.liquidity % 150) + 0.75).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      />
                      <InfoBadgeTooltipRow
                        label="Bundled token"
                        value={`${(160 + (token.liquidity % 15) + 0.8).toFixed(1)}%`}
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Layers />
                {(20 + (token.liquidity % 3) + 0.55).toFixed(2)}%
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
                        value={Math.floor(token.trade_24h_count * 0.02)}
                      />
                      <InfoBadgeTooltipRow
                        label="Snipers Holding"
                        value={Math.floor(token.trade_24h_count * 0.005)}
                        valueClassName="text-down"
                      />
                      <InfoBadgeTooltipRow
                        label="Snipers Sold"
                        value={Math.floor(token.trade_24h_count * 0.015)}
                      />
                      <InfoBadgeTooltipRow
                        label="Avg Profit"
                        value={`+${(token.volume_24h_usd % 5).toFixed(1)} SOL`}
                        valueClassName="text-up"
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Crosshair />
                {Math.floor(token.trade_24h_count * 0.02)}
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
                {formatCompactCurrency(token.market_cap * 1.35)}
              </span>
            </span>

            <span className="text-up">+35.1%</span>
          </div>

          <div className="w-1/2" />
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            MC{" "}
            <span className="w-16 font-medium text-info text-lg">
              {formatCompactCurrency(token.market_cap)}
            </span>
          </span>

          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, var(--color-foreground))`,
            }}
          />
          <span className="text-right font-semibold text-2xl text-white">
            {formatCompactCurrency(token.liquidity)}
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
            {token.meme_info.progress_percent.toFixed(0)}
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
            {formatCompactNumber(token.holder)}
          </InfoBadge>
          <InfoBadge tooltip="85 wallets that used Axiom, Padre, Photon etc., and current holding 0%">
            <Bot />
            {formatCompactNumber(token.unique_wallet_24h)}
          </InfoBadge>
          <InfoBadge
            className="[--accent:var(--color-warn)]"
            tooltip="Prio & Tip & Trading Fees 23.10 SOL"
          >
            <HandCoins />
            {token.global_fees_paid.toFixed(2)}
          </InfoBadge>
          <InfoBadge tooltip="Trades (24h)">
            TX {formatCompactNumber(token.trade_24h_count)}
          </InfoBadge>
        </div>

        <Separator
          className="w-1/4! grow-0"
          orientation="horizontal"
        />

        <div className="w-full text-right text-b-5 text-gray">
          V {formatCompactCurrency(token.volume_24h_usd)}
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
        {query.data?.items.map((token) => (
          <TokenRow
            key={token.address}
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
