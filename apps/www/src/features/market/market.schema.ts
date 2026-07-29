import { NumberFilter } from "@/schemas";
import z from "zod";

export const MarketView = z
  .enum(["watchlist", "trending", "radar", "surge", "pumpLive"])
  .catch("trending");

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
