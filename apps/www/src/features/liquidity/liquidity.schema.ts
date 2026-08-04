import z from "zod";

import { MeteoraIcon, OrcaIcon, RaydiumIcon } from "@/components/ui/icons";

export const PoolColumns = z.enum([
  "watchlist",
  "trending",
  "newTokens",
  "rwa",
]);

export const POOL_DEXES = {
  "meteora-dlmm": { icon: MeteoraIcon },
  "raydium-clmm": { icon: RaydiumIcon },
  "orca-whirlpool": { icon: OrcaIcon },
} as const;

export type PoolDex = keyof typeof POOL_DEXES;

export const LiquidityPoolFilters = z
  .object({
    dex: z.enum(Object.keys(POOL_DEXES) as PoolDex[]).nullish(),
    sort: z.enum(["bin_step"]),
  })
  .partial();
export type LiquidityPoolFilters = z.infer<typeof LiquidityPoolFilters>;

export const MeteoraTrade = z
  .object({
    type: z.enum(["spot", "curve", "bid-ask"]),
    amount: z.coerce.number<string>().gt(0),
    side: z.enum(["full-sided", "single-sided"]),
    ratio: z.number().int().min(0).max(100),
    minPrice: z.coerce.number<string>().positive(),
    maxPrice: z.coerce.number<string>().positive(),
    bins: z.number().int().positive(),
  })
  .superRefine((value, ctx) => {
    if (value.side === "single-sided" && value.ratio !== 100) {
      ctx.addIssue({
        code: "custom",
        path: ["ratio"],
        message: "Single-sided positions always use a 100% ratio",
      });
    }
    if (value.minPrice >= value.maxPrice) {
      ctx.addIssue({
        code: "custom",
        path: ["minPrice"],
        message: "Min price must be below the max price",
      });
    }
  });

export type MeteoraTradeInput = z.input<typeof MeteoraTrade>;
export type MeteoraTrade = z.infer<typeof MeteoraTrade>;

export const OrcaTrade = z
  .object({
    tab: z.enum(["full", "custom"]),
    tradeType: z.enum(["full-sided", "single-sided"]),
    selectedCurrency: z.enum(["base", "quote"]),
    amount: z.coerce.number<string>().gt(0),
    minPrice: z.coerce.number<string>().positive(),
    maxPrice: z.coerce.number<string>().positive(),
  })
  .superRefine((value, ctx) => {
    if (value.minPrice >= value.maxPrice) {
      ctx.addIssue({
        code: "custom",
        path: ["minPrice"],
        message: "Min price must be below the max price",
      });
    }
  });

export type OrcaTradeInput = z.input<typeof OrcaTrade>;
export type OrcaTrade = z.infer<typeof OrcaTrade>;

export const RaydiumTrade = z
  .object({
    preset: z.string(),
    minPrice: z.coerce.number<string>().positive(),
    maxPrice: z.coerce.number<string>().positive(),
    amount: z.coerce.number<string>().gt(0),
  })
  .superRefine((value, ctx) => {
    if (value.minPrice >= value.maxPrice) {
      ctx.addIssue({
        code: "custom",
        path: ["minPrice"],
        message: "Min price must be below the max price",
      });
    }
  });

export type RaydiumTradeInput = z.input<typeof RaydiumTrade>;
export type RaydiumTrade = z.infer<typeof RaydiumTrade>;
