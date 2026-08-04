import type { TokenDetail } from "@rhivadotfun/dataapi";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TokenDetailFilters } from "../market.type";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";

type TokenDetailTimeframeStatsProps = {
  token: TokenDetail;
  filters: TokenDetailFilters;
  onFilterChange: (filters: Partial<TokenDetailFilters>) => void;
};

const UNIT_TO_MINUTES: Record<string, number> = {
  m: 1,
  h: 60,
  d: 1440,
  w: 10080,
};

function timeframeToMinutes(timeframe: string): number {
  const match = /^(\d+)([mhdw])?$/.exec(timeframe.trim());
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = (match[2] ?? "h").toLowerCase();
  return value * (UNIT_TO_MINUTES[unit] ?? 60);
}

export const TokenDetailTimeframeStats = ({
  token,
  filters,
  onFilterChange,
}: TokenDetailTimeframeStatsProps) => {
  const availableTimeframes = token.timeframes?.windows
    ? Object.keys(token.timeframes.windows).sort(
        (a, b) => timeframeToMinutes(a) - timeframeToMinutes(b),
      )
    : [];

  const activeTimeframe = filters.timeframe || "24h";
  const activeWindow = token.timeframes?.windows?.[activeTimeframe];

  const volumeUsd = activeWindow?.volume_usd ?? 0;
  const buys = activeWindow?.buys !== undefined ? Number(activeWindow.buys) : 0;
  const sells = activeWindow?.sells ?? 0;
  const netBuyUsd = token.net_buy_usd;

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {availableTimeframes.map((timeframe) => {
          const window = token.timeframes?.windows?.[timeframe];
          const priceChangePct = window?.price_change_pct ?? 0;

          return (
            <Button
              key={timeframe}
              onClick={() => onFilterChange({ timeframe: timeframe as any })}
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
                {formatCompactNumber(priceChangePct)}%
              </p>
            </Button>
          );
        })}
      </div>

      <Separator />

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Vol", value: formatCompactCurrency(volumeUsd) },
          {
            label: "Buys",
            value: <span className="text-up">{formatCompactNumber(buys)}</span>,
          },
          {
            label: "Sells",
            value: (
              <span className="text-down">{formatCompactNumber(sells)}</span>
            ),
          },
          {
            label: "Net Buy",
            value: (
              <span
                className={cn(
                  netBuyUsd > 0 && "text-up",
                  netBuyUsd < 0 && "text-down",
                )}
              >
                {formatCompactCurrency(netBuyUsd)}
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
