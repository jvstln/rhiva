export type TokenTrending = {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  price_usd: number;
  price_change_pct: number;
  volume_usd: number;
  trades: number;
  buys: number;
  sells: number;
  traders: number;
  liquidity_usd: number;
  market_cap_usd: number;
  created_time: number;
};
