import type { Dex } from "./Dex";

export type TokenLiquidity = {
  mint: string;
  liquidity_usd: number;
  pools: {
    pool: string;
    dex: Dex;
    liquidity_usd: number;
  }[];
  series: { time: number; liquidity_usd: number }[];
  events: [];
};
