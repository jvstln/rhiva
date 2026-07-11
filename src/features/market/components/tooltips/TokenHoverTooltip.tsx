import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import type { MemeToken, TrendingToken } from "../../market.token.type";

interface TokenHoverTooltipProps {
  token: MemeToken | TrendingToken;
  children: React.ReactElement;
}

export function TokenHoverTooltip({ token, children }: TokenHoverTooltipProps) {
  const isMeme = "meme_info" in token;
  const progress =
    isMeme && token.meme_info?.progress_percent
      ? token.meme_info.progress_percent.toFixed(0)
      : "97";

  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right" align="start">
        <div className="flex flex-col">
          {/* Top Image Section */}
          <div className="relative flex aspect-square w-full items-center justify-center bg-black">
            <span className="absolute top-3 left-3 font-medium text-[#f55b38] text-b-4">
              Bounding {progress}%
            </span>
            {/* biome-ignore lint: keep it simple without next/image */}
            <img
              src={token.logo_uri || "https://picsum.photos/200"}
              alt={token.name}
              className="size-32 rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 text-b-4 leading-tight">
            {/* Real Stats Section */}
            <div>
              <div className="mb-2 flex justify-between text-b-5 text-gray uppercase tracking-wider">
                <span>Token Metrics</span>
                <span>Value</span>
              </div>
              <Separator className="mb-3 border-border/30" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Market Cap</span>
                  <span className="font-semibold text-up">
                    {formatCompactCurrency(token.market_cap)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Liquidity</span>
                  <span className="text-gray">
                    {formatCompactCurrency(token.liquidity)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">24h Volume</span>
                  <span className="text-gray">
                    {formatCompactCurrency(token.volume_24h_usd || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">24h Trades</span>
                  <span className="text-gray">
                    {formatCompactNumber(token.trade_24h_count || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Holders</span>
                  <span className="text-gray">
                    {formatCompactNumber(token.holder || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">
                    Unique Wallets (24h)
                  </span>
                  <span className="text-gray">
                    {formatCompactNumber(token.unique_wallet_24h || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Global Fees</span>
                  <span className="text-warning">
                    {token.global_fees_paid?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
