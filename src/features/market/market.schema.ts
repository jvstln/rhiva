import z from "zod";

export const MarketView = z
  .enum(["watchlist", "trending", "radar", "surge", "pumpLive"])
  .catch("trending");

export const RadarColumns = z.enum(["fresh", "heatingUp", "graduated"]);
export type RadarColumns = z.infer<typeof RadarColumns>;

export const BondingCurve = z.enum(["p1", "p2", "p3"]);
export type BondingCurve = z.infer<typeof BondingCurve>;

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
export type Timeframe = z.infer<typeof Timeframe>;
