import type { Dex } from "./Dex";

export type TokenPool = {
  pool: string;
  dex: Dex;
  quote_mint: string;
  price_usd: number;
  liquidity_usd: number;
  base_usd: number;
  quote_usd: number;
  tvl_usd: number;
  virtual_base_reserve: number;
  virtual_quote_reserve: number;
  base_reserve: number;
  quote_reserve: number;
  volume_usd: number;
  fees_usd: number;
  trades: number;
  traders: number;
  created_time: number;
  lp_burn_pct: number | null;
};
