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
