import {
  Activity,
  AlertTriangle,
  Bot,
  ChefHat,
  Crosshair,
  Crown,
  Eye,
  Ghost,
  Globe,
  Layers,
  Leaf,
  MessageCircle,
  Pencil,
  Search,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-button";
import { InfoBadge } from "@/components/ui/info-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { MemeToken } from "@/features/market/market.type";
import {
  cn,
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
} from "@/lib/utils";
import type { RadarColumns } from "../market.schema";
import { useMarketStore } from "../market.store";
import { TokenAvatar } from "./tooltips/TokenAvatar";

interface TokenCardProps {
  token: MemeToken;
  column: RadarColumns;
}

export function RadarTokenCard({ token, column }: TokenCardProps) {
  return (
    <article className="group/token-display border-border/70 border-b px-4 py-4 last:border-none">
      <div className="flex items-center gap-3">
        {/* LEFT COLUMN: Avatar and Address */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <TokenAvatar token={token} />
          <span className="text-[10px] text-gray">
            {token.address.slice(0, 4)}...{token.address.slice(-4)}
          </span>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 items-center gap-1">
              <h3 className="truncate font-bold text-white">{token.name}</h3>
              <span className="truncate text-b-4 text-gray">
                {token.symbol}
              </span>
              <InfoBadge>
                <Pencil />
              </InfoBadge>
              <CopyButton />
            </div>

            <div className="flex gap-1">
              <InfoBadge>
                V {formatCompactCurrency(token.volume_24h_usd)}
              </InfoBadge>
              <InfoBadge className="[--accent:var(--color-warn)]">
                MC {formatCompactCurrency(token.market_cap)}
              </InfoBadge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-1">
            <span className="font-medium text-b-5 text-down">
              {formatAge(token.recent_listing_time)}
            </span>
            <InfoBadge tooltip="Creator">
              <User />
              {token.meme_info.creator?.slice(0, 4)}
            </InfoBadge>
            {token.extensions?.website && (
              <InfoBadge
                className="[--accent:var(--color-warn)]"
                tooltip="Risky Website"
              >
                <AlertTriangle />
              </InfoBadge>
            )}
            {token.extensions?.website && (
              <InfoBadge tooltip="Website">
                <Globe />
              </InfoBadge>
            )}
            {token.extensions?.telegram && (
              <InfoBadge tooltip="Telegram">
                <MessageCircle />
              </InfoBadge>
            )}
            {token.extensions?.twitter && (
              <InfoBadge tooltip="Twitter">
                <Search />
              </InfoBadge>
            )}
            <InfoBadge tooltip="Trophy Score">
              <Trophy /> {0}
            </InfoBadge>
            <InfoBadge tooltip="User Score">
              <User /> {0}
            </InfoBadge>
            <InfoBadge tooltip="Rank" className="[--accent:var(--color-warn)]">
              <Crown /> {"16/17"}
            </InfoBadge>

            <InfoBadge tooltip="Holders">
              <Users />
              {formatCompactNumber(token.holder)}
            </InfoBadge>
            <InfoBadge tooltip="Bot Activity">
              <Bot />
              0/0%
            </InfoBadge>
            <InfoBadge tooltip="Unique Wallets (24h)">
              <Eye />
              {formatCompactNumber(token.unique_wallet_24h)}
            </InfoBadge>
            <InfoBadge className="ml-auto">
              <span>N </span>
              <span className="[--accent:var(--color-up)]">
                +{formatCompactNumber(token.buy_24h)} B
              </span>{" "}
              TX
              <span className="[--accent:var(--color-down)]">
                {formatCompactNumber(token.trade_24h_count)} —
              </span>
            </InfoBadge>
          </div>

          <div className="flex items-end justify-between gap-1">
            <ScrollArea className="min-w-0 grow">
              <div className="flex gap-x-1">
                <InfoBadge variant="badge" tone="down" tooltip="Total Holders">
                  <UserPlus />
                  {formatCompactNumber(token.holder)}
                </InfoBadge>
                <InfoBadge
                  variant="badge"
                  tone="up"
                  tooltip="Bonding Curve Progress"
                >
                  <ChefHat />
                  {`${token.meme_info.progress_percent.toFixed(1)}%`}
                </InfoBadge>
                <InfoBadge variant="badge" tone="up" tooltip="Liquidity">
                  <Ghost />
                  {formatCompactCurrency(token.liquidity)}
                </InfoBadge>
                <InfoBadge variant="badge" tone="up" tooltip="Trades (24h)">
                  <Layers />
                  {formatCompactNumber(token.trade_24h_count)}
                </InfoBadge>
                <InfoBadge variant="badge" tone="up" tooltip="Buy Volume (24h)">
                  <Activity />
                  {formatCompactCurrency(token.volume_buy_24h_usd)}
                </InfoBadge>
                <InfoBadge
                  variant="badge"
                  tone="up"
                  tooltip="Sell Volume (24h)"
                >
                  <Leaf />
                  {formatCompactCurrency(token.volume_sell_24h_usd)}
                </InfoBadge>
                <InfoBadge
                  variant="badge"
                  tone="down"
                  tooltip="Sell Count (24h)"
                >
                  <Leaf />
                  {`${token.sell_24h}`}
                </InfoBadge>
                <InfoBadge
                  variant="badge"
                  tooltip="Unique Traders (24h)"
                  tone="down"
                >
                  <Crosshair />
                  {`${token.unique_wallet_24h}`}
                </InfoBadge>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="flex shrink-0 gap-1.5">
              <BuyAndSellActions column={column} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

const BuyAndSellActions = ({ column }: { column: RadarColumns }) => {
  const quickBuy = useMarketStore(
    (state) => state.radarFilters[column].quickBuy,
  );
  const quickSell = useMarketStore(
    (state) => state.radarFilters[column].quickSell,
  );

  return (
    <div className="flex items-center justify-start gap-2">
      {quickSell !== null && (
        <Button variant="sell" size="sm">
          <span className={cn(quickSell > 0 && "group-hover/button:hidden")}>
            Sell
          </span>
          {quickSell > 0 && (
            <span className="hidden group-hover/button:inline">
              {quickSell}%
            </span>
          )}
        </Button>
      )}
      {quickBuy !== null && (
        <Button size="sm">
          <span className={cn(quickBuy > 0 && "group-hover/button:hidden")}>
            Buy
          </span>
          {quickBuy > 0 && (
            <span className="hidden group-hover/button:inline">
              {quickBuy} SOL
            </span>
          )}
        </Button>
      )}
    </div>
  );
};
