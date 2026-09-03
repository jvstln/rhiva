export type TokenPrice = {
  mint: string;
  price_usd: number;
  price_native: number;
  quote_mint: string;
  pool: string;
  block_time: number;
};
export type TokenPriceWithLiquidity = {
  mint: string;
  price_usd: number;
  price_native: number;
  quote_mint: string;
  pool: string;
  block_time: number;
  liquidity_usd?: number;
};
