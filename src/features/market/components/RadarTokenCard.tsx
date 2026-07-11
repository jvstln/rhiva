import {
  Activity,
  AlertTriangle,
  Bot,
  ChefHat,
  Copy,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import type { MemeToken } from "@/features/market/market.type";
import {
  formatAge,
  formatCompactCurrency,
  formatCompactNumber,
  getInitials,
} from "@/lib/utils";
import type { RadarColumns } from "../market.schema";
import { useMarketStore } from "../market.store";
import { TokenHoverTooltip } from "./tooltips/TokenHoverTooltip";

interface TokenCardProps {
  token: MemeToken;
  column: RadarColumns;
}

export function RadarTokenCard({ token, column }: TokenCardProps) {
  return (
    <article className="border-border/70 border-b px-4 py-4 last:border-none">
      <div className="flex gap-3">
        {/* LEFT COLUMN: Avatar and Address */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <TokenHoverTooltip token={token}>
            <Avatar variant="square" size={"lg"} className="relative shrink-0">
              <AvatarImage src={token.logo_uri ?? ""} />
              <AvatarFallback className="shimmer">
                {getInitials(token.name)}
              </AvatarFallback>
            </Avatar>
          </TokenHoverTooltip>
          <span className="text-b-5 text-gray">
            {token.address.slice(0, 4)}...{token.address.slice(-4)}
          </span>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <h3 className="truncate font-bold text-b-1 text-white">
                {token.name}
              </h3>
              <span className="truncate text-b-4 text-gray">
                {token.symbol}
              </span>
              <Pencil className="size-3 shrink-0 text-gray" />
              <Copy className="size-3 shrink-0 text-gray" />
            </div>
            <div className="shrink-0 text-right text-b-4">
              <span className="text-gray">
                V {formatCompactCurrency(token.volume_24h_usd)}
              </span>{" "}
              <span className="font-semibold text-warning">
                MC {formatCompactCurrency(token.market_cap)}
              </span>
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-gray">
            <span className="font-medium text-b-5 text-down">
              {formatAge(token.recent_listing_time)}
            </span>
            <InfoBadge
              variant="inline"
              icon={User}
              tone="info"
              label={token.meme_info.creator?.slice(0, 4)}
              tooltip="Creator"
            />
            {token.extensions?.website && (
              <InfoBadge
                variant="inline"
                icon={AlertTriangle}
                tone="warning"
                tooltip="Risky Website"
              />
            )}
            {token.extensions?.website && (
              <InfoBadge variant="inline" icon={Globe} tooltip="Website" />
            )}
            {token.extensions?.telegram && (
              <InfoBadge
                variant="inline"
                icon={MessageCircle}
                tooltip="Telegram"
              />
            )}
            {token.extensions?.twitter && (
              <InfoBadge variant="inline" icon={Search} tooltip="Twitter" />
            )}
            <InfoBadge
              variant="inline"
              icon={Trophy}
              label={0}
              tooltip="Trophy Score"
            />
            <InfoBadge
              variant="inline"
              icon={User}
              label="0"
              tooltip="User Score"
            />
            <InfoBadge
              variant="inline"
              icon={Crown}
              label="16/17"
              tone="warning"
              tooltip="Rank"
            />
            <InfoBadge
              variant="inline"
              icon={Users}
              label={formatCompactNumber(token.holder)}
              tooltip="Holders"
            />
            <InfoBadge
              variant="inline"
              icon={Bot}
              label="0/0%"
              tooltip="Bot Activity"
            />
            <InfoBadge
              variant="inline"
              icon={Eye}
              label={formatCompactNumber(token.unique_wallet_24h)}
              tooltip="Unique Wallets (24h)"
            />
            <span className="ml-auto whitespace-nowrap text-b-5">
              <span className="text-gray">N </span>
              <span className="text-up">
                +{formatCompactNumber(token.buy_24h)} B
              </span>{" "}
              TX {formatCompactNumber(token.trade_24h_count)}{" "}
              <span className="text-down">—</span>
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-1.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-1.5">
                <InfoBadge
                  variant="badge"
                  icon={UserPlus}
                  label={formatCompactNumber(token.holder)}
                  tone="down"
                  filled
                  tooltip="Total Holders"
                />
                <InfoBadge
                  variant="badge"
                  icon={ChefHat}
                  label={`${token.meme_info.progress_percent.toFixed(1)}%`}
                  tone="up"
                  filled
                  tooltip="Bonding Curve Progress"
                />
                <InfoBadge
                  variant="badge"
                  icon={Ghost}
                  label={formatCompactCurrency(token.liquidity)}
                  tone="up"
                  filled
                  tooltip="Liquidity"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <InfoBadge
                  variant="badge"
                  icon={Layers}
                  label={formatCompactNumber(token.trade_24h_count)}
                  tone="up"
                  filled
                  tooltip="Trades (24h)"
                />
                <InfoBadge
                  variant="badge"
                  icon={Activity}
                  label={formatCompactCurrency(token.volume_buy_24h_usd)}
                  tone="up"
                  filled
                  tooltip="Buy Volume (24h)"
                />
                <InfoBadge
                  variant="badge"
                  icon={Leaf}
                  label={formatCompactCurrency(token.volume_sell_24h_usd)}
                  tone="up"
                  filled
                  tooltip="Sell Volume (24h)"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <InfoBadge
                  variant="badge"
                  icon={Leaf}
                  label={`${token.sell_24h}`}
                  tone="down"
                  filled
                  tooltip="Sell Count (24h)"
                />
                <InfoBadge
                  variant="badge"
                  icon={Crosshair}
                  label={`${token.unique_wallet_24h}`}
                  tooltip="Unique Traders (24h)"
                  tone="down"
                  filled
                />
              </div>
            </div>

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
    <>
      {quickSell !== null && (
        <Button variant="sell" size="sm">
          Sell {quickSell > 0 ? `(${quickSell}%)` : ""}
        </Button>
      )}
      {quickBuy !== null && (
        <Button variant="default" size="sm">
          Buy {quickBuy > 0 ? `(${quickBuy}%)` : ""}
        </Button>
      )}
    </>
  );
};
