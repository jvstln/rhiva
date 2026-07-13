import {
  Activity,
  BadgeCheck,
  Bot,
  Bug,
  Coins,
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
import { InfoBadge } from "@/components/ui/info-badge";
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
      <div className="flex min-w-0 flex-1 basis-1/4 gap-3">
        <TokenHoverTooltip token={token}>
          <Avatar variant="square" size="lg" className="relative shrink-0">
            <AvatarImage src={token.logo_uri ?? ""} />
            <AvatarFallback className="shimmer">
              {getInitials(token.name)}
            </AvatarFallback>
            <PillIcon className="-bottom-1 -right-1 absolute size-4 rounded-full border border-primary bg-background p-0.5 text-info" />
          </Avatar>
        </TokenHoverTooltip>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 text-b-3">
            <span className="font-semibold">{token.name}</span>
            <span className="truncate text-gray">{token.symbol}</span>
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
            <span className="text-border">|</span>
            <span className="truncate">
              {token.address.slice(0, 4)}...{token.address.slice(-4)}
            </span>
            <CopyButton />
            <InfoBadge>
              <Search />
            </InfoBadge>
          </div>

          <div className="flex flex-wrap items-center gap-x-1">
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="New Users (24h)"
            >
              <UserPlus />
              20%
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-info)]"
              tooltip="DexScreener Listed"
            >
              <Shield />
              DS
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="Bug / Error Rate"
            >
              <Bug />
              0%
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="Liquidity Depth / Layers"
            >
              <Layers />
              2%
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="Trading Activity Spike"
            >
              <Activity />
              0%
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="Organic Growth"
            >
              <Leaf />
              0.3%
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="Community Score"
            >
              <Leaf />
              0%
            </InfoBadge>
            <InfoBadge
              variant="badge"
              className="[--accent:var(--color-up)]"
              tooltip="Sniper Activity"
            >
              <Crosshair />
              0%
            </InfoBadge>
          </div>
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
      <div className="flex w-[280px] shrink-0 basis-1/5 flex-col items-end gap-1.5 text-b-4">
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
