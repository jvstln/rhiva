import {
  Activity,
  BadgeCheck,
  Bot,
  Bug,
  Coins,
  Copy,
  Crosshair,
  Crown,
  Layers,
  Leaf,
  Pencil,
  PillIcon,
  Search,
  Shield,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { QueryState } from "@/components/layout/QueryState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  getInitials,
} from "@/lib/utils";
import { useSurgeTokens } from "../market.hook";
import { useMarketStore } from "../market.store";
import { TokenHoverTooltip } from "./tooltips/TokenHoverTooltip";

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
        <TokenHoverTooltip token={token}>
          <Avatar variant="square" size="lg" className="relative shrink-0">
            <AvatarImage src={token.logo_uri ?? ""} />
            <AvatarFallback className="shimmer">
              {getInitials(token.name)}
            </AvatarFallback>
            <PillIcon className="-bottom-1 -right-1 absolute size-4 rounded-full border border-primary bg-background p-0.5 text-info" />
          </Avatar>
        </TokenHoverTooltip>

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
            <Separator orientation="vertical" className="h-4/5 self-center" />
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
                <UserPlus />+
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
                      <InfoBadgeTooltipRow label="Balance" value="$0" />
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
                      Liquidity Depth
                    </InfoBadgeTooltipHeader>
                    <InfoBadgeTooltipGrid>
                      <InfoBadgeTooltipRow
                        label="Total Liquidity"
                        value={`${formatCompactCurrency(token.liquidity)}`}
                      />
                      <InfoBadgeTooltipRow
                        label="+2% Depth"
                        value={`${formatCompactCurrency(token.liquidity * 0.1)}`}
                        valueClassName="text-up"
                      />
                      <InfoBadgeTooltipRow
                        label="-2% Depth"
                        value={formatCompactCurrency(token.liquidity * 0.12)}
                        valueClassName="text-down"
                      />
                    </InfoBadgeTooltipGrid>
                  </div>
                }
              >
                <Layers />${formatCompactCurrency(token.liquidity * 0.1)}
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
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <Separator orientation="vertical" className="" />

      {/* Market data */}
      <div className="flex min-w-0 flex-1 basis-2/4 flex-col justify-center gap-1.5 text-b-4">
        <div className="flex w-full items-center justify-between gap-1.5">
          <div className="flex w-1/2 items-center gap-2">
            <span className="w-8 text-gray">ATH</span>
            <span className="font-medium text-info">
              {formatCompactCurrency(token.market_cap * 1.35)}
            </span>
            <span className="text-up">+35.1%</span>
          </div>
          <div className="w-1/2" />
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="w-8 text-gray">MC</span>
          <span className="w-16 font-medium text-info">
            {formatCompactCurrency(token.market_cap)}
          </span>

          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, var(--color-foreground))`,
            }}
          />
          <span className="w-16 text-right font-semibold text-white">
            {formatCompactCurrency(token.liquidity)}
          </span>
          <span
            className={cn(
              "w-16 text-right",
              priceIsUp ? "text-up" : "text-down",
            )}
          >
            {priceChange > 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <Separator orientation="vertical" className="" />

      {/* Activity + buy */}
      <div className="flex max-w-75 shrink-0 basis-1/5 flex-col items-end gap-1.5 text-b-4">
        <div className="flex items-center gap-3">
          <span className="text-up">
            {formatAge(token.recent_listing_time)}
          </span>
          <SurgeBuyButton />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-x-1">
          <InfoBadge tooltip="Bonding Curve Progress">
            <Trophy />
            {token.meme_info.progress_percent.toFixed(0)}
          </InfoBadge>
          <InfoBadge className="[--accent:var(--color-warn)]" tooltip="Rank">
            <Crown />
            8/2977
          </InfoBadge>
          <InfoBadge tooltip="Holders">
            <Users />
            {formatCompactNumber(token.holder)}
          </InfoBadge>
          <InfoBadge tooltip="Unique Wallets">
            <Bot />
            {formatCompactNumber(token.unique_wallet_24h)}
          </InfoBadge>
          <InfoBadge
            className="[--accent:var(--color-warn)]"
            tooltip="Fees Paid"
          >
            <Coins />
            {token.global_fees_paid.toFixed(2)}
          </InfoBadge>
          <InfoBadge tooltip="Trades (24h)">
            TX {formatCompactNumber(token.trade_24h_count)}
          </InfoBadge>
        </div>

        <Separator className="w-1/4! grow-0" orientation="horizontal" />

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
      <QueryState query={query} getIsLoading={(q) => q.isPending}>
        {query.data?.items.map((token) => (
          <TokenRow key={token.address} token={token} />
        ))}
      </QueryState>
    </div>
  );
}

const SurgeBuyButton = () => {
  const quickBuy = useMarketStore((state) => state.surgeFilters.quickBuy);

  return (
    quickBuy !== null && (
      <Button size="sm" variant={"soft"}>
        <Zap className="size-3" fill="currentColor" />

        <span className={cn(quickBuy > 0 && "group-hover/button:hidden")}>
          Buy
        </span>

        <span className="hidden group-hover/button:inline">{quickBuy} SOL</span>
      </Button>
    )
  );
};
