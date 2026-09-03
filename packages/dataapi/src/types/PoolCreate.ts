import type { Dex } from "./Dex";

export type PoolCreate = {
  kind: "pool";
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  inner_ix_index: number;
  dex: Dex;
  mint: string;
  pool: string;
  base_mint: string;
  quote_mint: string;
  name: string;
  symbol: string;
  uri: string;
  creator: string;
  indexed_at: number;
};
