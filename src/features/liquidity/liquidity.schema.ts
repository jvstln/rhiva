import z from "zod";
import { MeteoraIcon, OrcaIcon, RaydiumIcon } from "@/components/ui/icons";

export const PoolColumns = z.enum([
  "watchlist",
  "trending",
  "newTokens",
  "rwa",
]);

export const POOLS = [
  { id: "meteora", icon: MeteoraIcon },
  { id: "orca", icon: OrcaIcon },
  { id: "raydium", icon: RaydiumIcon },
] as const;

export type Pool = (typeof POOLS)[number]["id"];
