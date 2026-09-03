import type { TokenFull } from "@rhivadotfun/dataapi";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TokenDetailFilters } from "../market.type";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import { type Timeframe, getTokenWindowStats } from "../market.schema";

type TokenDetailTimeframeStatsProps = {
  token: TokenFull;
  filters: TokenDetailFilters;
  onFilterChange: (filters: Partial<TokenDetailFilters>) => void;
};

const DISPLAY_TIMEFRAMES: Timeframe[] = ["5m", "1h", "4h", "24h"];

export const TokenDetailTimeframeStats = ({
  token,
  filters,
  onFilterChange,
}: TokenDetailTimeframeStatsProps) => {
  const activeTimeframe = filters.timeframe || "24h";
  const activeWindow = getTokenWindowStats(token, activeTimeframe);

  const volumeUsd = activeWindow?.volume_usd ?? 0;
  const buys = activeWindow?.buys !== undefined ? Number(activeWindow.buys) : 0;
  const sells = activeWindow?.sells ?? 0;
  const netBuyUsd = token.screener?.net_buy_usd ?? 0;

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {DISPLAY_TIMEFRAMES.map((timeframe) => {
          const window = getTokenWindowStats(token, timeframe);
          const priceChangePct = window?.price_change_pct ?? 0;

          return (
            <Button
              key={timeframe}
              onClick={() => onFilterChange({ timeframe })}
              variant={filters.timeframe === timeframe ? "outline" : "ghost"}
              data-active={filters.timeframe === timeframe || undefined}
              className={cn("h-auto flex-col rounded-md py-2")}
            >
              <span className="">{timeframe}</span>
              <p
                className={cn(
                  "text-xs",
                  priceChangePct > 0
                    ? "text-up"
                    : priceChangePct < 0
                      ? "text-down"
                      : "text-muted-foreground",
                )}
              >
                {priceChangePct != null
                  ? `${formatCompactNumber(priceChangePct, { withSign: true })}%`
                  : "--"}
              </p>
            </Button>
          );
        })}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray">Vol</span>
        <span className="font-medium text-white">
          {formatCompactCurrency(volumeUsd)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray">Buys</span>
        <span className="font-medium text-up">{formatCompactNumber(buys)}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray">Sells</span>
        <span className="font-medium text-down">
          {formatCompactNumber(sells)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray">Net Buy</span>
        <span
          className={cn(
            "font-medium",
            netBuyUsd > 0
              ? "text-up"
              : netBuyUsd < 0
                ? "text-down"
                : "text-white",
          )}
        >
          {formatCompactCurrency(netBuyUsd)}
        </span>
      </div>
    </div>
  );
};
