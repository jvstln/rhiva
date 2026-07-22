import z from "zod";
import { MeteoraIcon, OrcaIcon, RaydiumIcon } from "@/components/ui/icons";

export const PoolColumns = z.enum([
  "watchlist",
  "trending",
  "newTokens",
  "rwa",
]);

export const POOLS = [
  { id: "meteora-dlmm", icon: MeteoraIcon },
  { id: "orca", icon: OrcaIcon },
  { id: "raydium-clmm", icon: RaydiumIcon },
] as const;

export type PoolDex = (typeof POOLS)[number]["id"];

export const LiquidityPoolFilters = z
  .object({
    dex: z.enum(POOLS.map((p) => p.id)),
    sort: z.enum(["bin_step"]),
  })
  .partial();
export type LiquidityPoolFilters = z.infer<typeof LiquidityPoolFilters>;
