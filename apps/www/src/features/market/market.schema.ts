import z from "zod";
import type { TokenFull, Window } from "@rhivadotfun/dataapi";

import { NumberFilter } from "@/schemas";

export const MarketView = z
  .enum([
    "watchlist",
    "latest",
    "trending",
    "radar",
    "surge",
    "top-gainers",
    "stock",
    "stablecoin",
  ])
  .catch("trending");
export type MarketView = z.infer<typeof MarketView>;

export const RadarColumns = z.enum(["fresh", "heatingUp", "graduated"]);
export type RadarColumns = z.infer<typeof RadarColumns>;

export const Preset = z.enum(["p1", "p2", "p3"]);
export type Preset = z.infer<typeof Preset>;

export const Timeframe = z.enum([
  "1m",
  "5m",
  "30m",
  "1h",
  "2h",
  "4h",
  "8h",
  "24h",
  "7d",
  "30d",
]);
export type Timeframe = `${number}${"m" | "h" | "d"}`;

export const TIMEFRAME_TO_WINDOW: Record<string, Window> = {
  "1m": "60",
  "5m": "300",
  "15m": "900",
  "30m": "1800",
  "1h": "3600",
  "2h": "7200",
  "4h": "14400",
  "6h": "21600",
  "8h": "21600",
  "12h": "43200",
  "24h": "86400",
  "3d": "259200",
  "7d": "604800",
  "30d": "604800",
};

export const getTokenWindowStats = (token: TokenFull, timeframe?: string) => {
  if (!token.stats) return undefined;
  const windowKey =
    (timeframe ? TIMEFRAME_TO_WINDOW[timeframe] : undefined) ?? "86400";
  return (
    token.stats[windowKey] ??
    token.stats["3600"] ??
    Object.values(token.stats)[0]
  );
};

export const SurgeFilters = z
  .object({
    direction: z.enum(["up", "down"]),
    sort: z.enum(["surge", "volume", "mcap", "entry_change", "age"]),
    order: z.enum(["asc", "desc"]),
    min_surge_pct: NumberFilter,
    min_mcap: NumberFilter,
    max_mcap: NumberFilter,
    min_liquidity: NumberFilter,
    max_age_sec: NumberFilter,
  })
  .partial();
export type SurgeFiltersInput = z.input<typeof SurgeFilters>;
export type SurgeFilters = z.infer<typeof SurgeFilters>;

export const getTokenBondingPct = (token: TokenFull): number => {
  if (token.screener?.is_graduated) return 100;
  return token.screener?.bonding_pct ?? 0;
};
