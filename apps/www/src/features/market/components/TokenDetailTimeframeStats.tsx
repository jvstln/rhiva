import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import type { Token } from "../market.token.type";
import type { TokenDetailFilters } from "../market.type";
import { mapToken } from "../market.util";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type TokenDetailTimeframeStatsProps = {
  token: Token;
  filters: TokenDetailFilters;
  onFilterChange: (filters: Partial<TokenDetailFilters>) => void;
};

export const TokenDetailTimeframeStats = ({
  token,
  filters,
  onFilterChange,
}: TokenDetailTimeframeStatsProps) => {
  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {token.timeframes.map((timeframe) => {
          const tokenWithTimeframeInfo = mapToken(token.original, {
            timeframe,
          });

          return (
            <Button
              key={timeframe}
              onClick={() => onFilterChange({ timeframe })}
              variant={filters.timeframe === timeframe ? "outline" : "ghost"}
              data-active={filters.timeframe === timeframe || undefined}
              className={cn("h-auto flex-col rounded-md py-2")}
              tooltip={`${tokenWithTimeframeInfo.priceChangePct}%`}
            >
              <span className="">{timeframe}</span>
              <p
                className={cn(
                  "text-xs",
                  tokenWithTimeframeInfo.priceChangePct > 0
                    ? "text-up"
                    : tokenWithTimeframeInfo.priceChangePct < 0
                      ? "text-down"
                      : "text-muted-foreground",
                )}
              >
                {/* {formatSignedPercent(tokenWithTimeframeInfo.priceChangePct)} */}
                {formatCompactNumber(tokenWithTimeframeInfo.priceChangePct)}%
              </p>
            </Button>
          );
        })}
      </div>

      <Separator />

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Vol", value: formatCompactCurrency(token.volumeUsd) },
          {
            label: "Buys",
            value: (
              <span className="text-up">{formatCompactNumber(token.buys)}</span>
            ),
          },
          {
            label: "Sells",
            value: (
              <span className="text-down">
                {formatCompactNumber(token.sells)}
              </span>
            ),
          },
          {
            label: "Net Buy",
            value: (
              <span
                className={cn(
                  token.netBuyUsd > 0 && "text-up",
                  token.netBuyUsd < 0 && "text-down",
                )}
              >
                {formatCompactCurrency(token.netBuyUsd)}
              </span>
            ),
          },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-muted-foreground text-xs">{s.label}</p>
            <p className="font-medium text-sm text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
