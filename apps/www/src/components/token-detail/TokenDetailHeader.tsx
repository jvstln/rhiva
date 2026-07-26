import { Bot, Copy, Share2, Star, User } from "lucide-react";
import React from "react";
import type { Token } from "@/features/market/market.token.type";
import { TokenThumbnail } from "@/features/market/components/TokenThumbnail";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { TokenAvatar } from "@/features/market/components/tooltips/TokenAvatar";

type TokenDetailHeaderProps = { token: Token };

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(0)}%`;
}

export function TokenDetailHeader({ token }: TokenDetailHeaderProps) {
  const title = token.name ?? token.symbol ?? "Token";
  const subtitle = token.description ?? `${token.symbol ?? "Token"} coin`;
  const price = token.live?.dexscreener_price_usd ?? token.live?.price_usd;
  const shortMint = token.mint
    ? `${token.mint.slice(0, 6)}...${token.mint.slice(-4)}`
    : "N/A";

  const headerStats = [
    {
      label: "Price",
      value: price !== undefined ? formatCompactCurrency(price) : "N/A",
    },
    {
      label: "Liq",
      value:
        token.live?.dexscreener_liquidity_usd !== undefined
          ? formatCompactCurrency(token.live.dexscreener_liquidity_usd)
          : "N/A",
    },
    {
      label: "24h Vol",
      value: formatCompactCurrency(token.timeframes?.["24h"]?.volume_usd),
    },
    {
      label: "Total Fees",
      value:
        token.global_fees_paid !== undefined
          ? formatCompactCurrency(token.global_fees_paid)
          : "N/A",
    },
    {
      label: "Total supply",
      value:
        token.totalSupply !== undefined
          ? formatCompactNumber(token.totalSupply)
          : "N/A",
    },
    {
      label: "B. Curve",
      value: formatPercent(token.bonding?.completion_pct),
      tone: "down" as const,
    },
    { label: "Status", value: token.live?.has_paid_order ? "Paid" : "Unpaid" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-8 border-border/70 border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <TokenAvatar token={token} />

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-b-1 text-white">{title}</h1>
            <span className="text-b-4 text-gray">{subtitle}</span>
            <Star className="size-3.5 text-gray" />
            <Share2 className="size-3.5 text-gray" />
            <Bot className="size-4 text-primary" />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-b-5 text-gray">
            <span>
              {token.live?.updated_at
                ? new Date(token.live.updated_at).toLocaleDateString()
                : "Live"}
            </span>
            <span>{shortMint}</span>
            <User className="size-3" />
            <Copy className="size-3" />
          </div>
        </div>
      </div>

      <div className="font-bold text-h5 text-white">
        {price !== undefined ? formatCompactCurrency(price) : "N/A"}
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-x-7 gap-y-2">
        {headerStats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i !== 0 && <Separator orientation="vertical" />}
            <div>
              <p className="text-b-5 text-gray">{stat.label}</p>
              <p
                className={cn(
                  "font-semibold text-b-2",
                  stat.tone === "down" ? "text-down" : "text-white",
                )}
              >
                {stat.value}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
