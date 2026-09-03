export type TokenStats<T extends string> = {
  mint: string;
  primary_pool: string;
  windows: Record<
    T,
    {
      trades: number;
      buys: number;
      sells: number;
      traders: number;
      volume_usd: number;
      fees_usd: number;
      open: number;
      high: number;
      low: number;
      close: number;
      price_change_pct: number;
    }
  >;
};
