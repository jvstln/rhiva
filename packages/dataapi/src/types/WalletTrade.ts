import type { Dex } from "./Dex";

export type WalletTrade = {
  mint: string;
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  dex: Dex;
  pool: string;
  side: "buy" | "sell";
  trader: string;
  price: number;
  price_usd: number;
  volume_usd: number;
  base_amount: number;
  quote_amount: number;
  base_decimals: number;
  quote_decimals: number;
  base_reserve: number;
  quote_reserve: number;
  fee_amount: number;
  fee_mint: string;
  fee_pct: number;
  price_impact_pct: number;
};
