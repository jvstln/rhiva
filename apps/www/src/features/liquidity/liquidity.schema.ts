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
  orca: { icon: OrcaIcon },
  "raydium-clmm": { icon: RaydiumIcon },
} as const;

export type PoolDex = keyof typeof POOL_DEXES;

export const LiquidityPoolFilters = z
  .object({
    dex: z.enum(Object.keys(POOL_DEXES) as PoolDex[]),
    sort: z.enum(["bin_step"]),
  })
  .partial();
export type LiquidityPoolFilters = z.infer<typeof LiquidityPoolFilters>;
