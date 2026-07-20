import type { ReactNode } from "react";
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
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-button";
import { InfoBadge } from "@/components/ui/info-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Token } from "@/features/market/market.type";
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
  token: Token;
  column: RadarColumns;
}

interface RadarMetric {
  id: string;
  tooltip: string;
  tone: "up" | "down";
  icon: LucideIcon;
  value: (token: Token) => ReactNode;
}

const RADAR_METRICS: RadarMetric[] = [
  {
    id: "totalHolders",
    tooltip: "Total Holders",
    tone: "down",
    icon: UserPlus,
    value: (token) => formatCompactNumber(token.holders?.holder_count),
  },
  {
    id: "bondingCurve",
    tooltip: "Bonding Curve Progress",
    tone: "up",
    icon: ChefHat,
    value: (token) => `${(token.bonding?.completion_pct ?? 0).toFixed(1)}%`,
  },
  {
    id: "liquidity",
    tooltip: "Liquidity",
    tone: "up",
    icon: Ghost,
    value: (token) =>
      formatCompactCurrency(token.live?.dexscreener_liquidity_usd),
  },
  {
    id: "trades",
    tooltip: "Trades (24h)",
    tone: "up",
    icon: Layers,
    value: (token) =>
      formatCompactNumber(token.timeframes?.["24h"]?.trade_count),
  },
  {
    id: "buyVolume",
    tooltip: "Buy Volume (24h)",
    tone: "up",
    icon: Activity,
    value: (token) =>
      formatCompactCurrency(token.timeframes?.["24h"]?.volume_buy_usd),
  },
  {
    id: "sellVolume",
    tooltip: "Sell Volume (24h)",
    tone: "up",
    icon: Leaf,
    value: (token) =>
      formatCompactCurrency(token.timeframes?.["24h"]?.volume_sell_usd),
  },
  {
    id: "sellCount",
    tooltip: "Sell Count (24h)",
    tone: "down",
    icon: Leaf,
    value: (token) => `${token.sells ?? 0}`,
  },
  {
    id: "uniqueTraders",
    tooltip: "Unique Traders (24h)",
    tone: "down",
    icon: Crosshair,
    value: (token) => `${token.timeframes?.["24h"]?.unique_wallet ?? 0}`,
  },
];

export function RadarTokenCard({ token, column }: TokenCardProps) {
  return (
    <article className="group/token-display border-border/70 border-b px-4 py-4 last:border-none">
      <div className="flex items-center gap-3">
        {/* LEFT COLUMN: Avatar and Address */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <TokenAvatar token={token} />
          <span className="text-[10px] text-gray">
            {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
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
                V {formatCompactCurrency(token.timeframes?.["24h"]?.volume_usd)}
              </InfoBadge>
              <InfoBadge className="[--accent:var(--color-warn)]">
                MC{" "}
                {formatCompactCurrency(token.live?.dexscreener_market_cap_usd)}
              </InfoBadge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-1">
            <span className="font-medium text-b-5 text-down">
              {formatAge(token.recent_listing_time)}
            </span>
            <InfoBadge tooltip="Creator">
              <User />
              {token.creator?.slice(0, 4)}
            </InfoBadge>
            {token.social?.website_url && (
              <InfoBadge
                className="[--accent:var(--color-warn)]"
                tooltip="Risky Website"
              >
                <AlertTriangle />
              </InfoBadge>
            )}
            {token.social?.website_url && (
              <InfoBadge tooltip="Website">
                <Globe />
              </InfoBadge>
            )}
            {token.social?.telegram_url && (
              <InfoBadge tooltip="Telegram">
                <MessageCircle />
              </InfoBadge>
            )}
            {token.social?.twitter_url && (
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
            <InfoBadge
              tooltip="Rank"
              className="[--accent:var(--color-warn)]"
            >
              <Crown /> {"16/17"}
            </InfoBadge>

            <InfoBadge tooltip="Holders">
              <Users />
              {formatCompactNumber(token.holders?.holder_count)}
            </InfoBadge>
            <InfoBadge tooltip="Bot Activity">
              <Bot />
              0/0%
            </InfoBadge>
            <InfoBadge tooltip="Unique Wallets (24h)">
              <Eye />
              {formatCompactNumber(token.timeframes?.["24h"]?.unique_wallet)}
            </InfoBadge>
            <InfoBadge className="ml-auto">
              <span>N </span>
              <span className="[--accent:var(--color-up)]">
                +{formatCompactNumber(token.buys)} B
              </span>{" "}
              TX
              <span className="[--accent:var(--color-down)]">
                {formatCompactNumber(token.timeframes?.["24h"]?.trade_count)} —
              </span>
            </InfoBadge>
          </div>

          <div className="flex items-end justify-between gap-1">
            <ScrollArea className="min-w-0 grow">
              <div className="flex gap-x-1">
                {RADAR_METRICS.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <InfoBadge
                      key={metric.id}
                      variant="badge"
                      tone={metric.tone}
                      tooltip={metric.tooltip}
                    >
                      <Icon />
                      {metric.value(token)}
                    </InfoBadge>
                  );
                })}
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
        <Button
          variant="sell"
          size="sm"
        >
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
