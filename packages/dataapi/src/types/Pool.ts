import type { Dex } from "./Dex";
import type { Window } from "./Window";

export type PoolDetail<T extends Window> = {
  pool: string;
  dex: Dex;
  mint: string;
  quote_mint: string;
  name: string;
  symbol: string;
  price: number;
  price_usd: number;
  base_reserve: number;
  quote_reserve: number;
  liquidity_usd: number;
  base_usd: number;
  quote_usd: number;
  tvl_usd: number;
  lp_burn_pct: number | null;
  created_time: number;
  created_signature: string | null;
  deployer: string | null;
  fee_apr_pct: number;
  fees_24h_usd: number;
  volume_tvl_ratio: number;
  lp_deposit_24h_usd: number;
  lp_withdraw_24h_usd: number;
  lp_net_flow_24h_usd: number;
  lp_adds_24h: number;
  lp_removes_24h: number;
  lp_providers_24h: number;
  depth_1pct_usd: number;
  depth_2pct_usd: number;
  depth_5pct_usd: number;
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

export type Pool = {
  pool: string;
  mint: string;
  dex: Dex;
  quote_mint: string;
  price_usd: number;
  tvl_usd: number;
  base_usd: number;
  quote_usd: number;
  name: string;
  symbol: string;
  image: string;
  volume_usd: number;
  fees_usd: number;
  trades: number;
  traders: number;
  price_change_pct: number;
  volume_change_pct: number;
  trades_change_pct: number;
  traders_change_pct: number;
  tvl_change_pct: number;
  deposit_usd: number;
  withdraw_usd: number;
  net_deposit_usd: number;
  adds: number;
  removes: number;
  providers: number;
  fee_tvl_pct: number;
  volume_tvl_pct: number;
  volume_per_min_usd: number;
  fees_per_min_usd: number;
  new_providers: number;
  window: number;
};
