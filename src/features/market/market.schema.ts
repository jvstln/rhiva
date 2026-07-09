import z from "zod";

export const MarketView = z
  .enum(["watchlist", "trending", "radar", "surge", "pumpLive"])
  .catch("trending");

export const RadarColumns = z.enum(["fresh", "heatingUp", "graduated"]);
export type RadarColumns = z.infer<typeof RadarColumns>;

export const QuickSell = z.object({
  value: z.union([z.string(), z.number()]).nullable(),
  unit: z.enum(["percent", "init"]),
});
export type QuickSell = z.infer<typeof QuickSell>;
