import type { PoolRow } from "@/data/liquidity-data";

export type LiquidityState = {
  liquidityFilters: {
    zapIn: number | null;
  };
  setLiquidityFilters: (
    filters: Partial<LiquidityState["liquidityFilters"]>,
  ) => void;
};

export type RawLiquidityPool = {
  pool_address: string;
  dex: string;
  token_mint_a: string;
  token_mint_b: string;
  token_vault_a: string;
  token_vault_b: string;
  tick_spacing: number;
  bin_step: number;
  liquidity: string;
  sqrt_price: string;
  tick_current: number;
  active_id: number;
  volume_1h_usd: number;
  volume_24h_usd: number;
  last_update_ms: number;
  base_factor?: number;
  variable_fee_control?: number;
  volatility_accumulator?: number;
  protocol_share?: number;
  total_fee_pct?: string;
  base_fee_pct?: string;
  dynamic_fee_pct?: string;
  protocol_fee_pct?: string;
  market_cap_usd?: number; // not yet available
  active_tvl_usd?: number; // not yet available
  market_cap_change_pct?: number; // not yet available
  tvl_change_pct?: number; // not yet available
  active_tvl_change_pct?: number; // not yet available
  fees_ratio?: number; // not yet available
  fees_ratio_change_pct?: number; // not yet available
  volume_change_pct?: number; // not yet available
  volume_ratio?: number; // not yet available
  volume_ratio_change_pct?: number; // not yet available
  swaps_24h?: number; // not yet available
  traders_24h?: number; // not yet available
  total_lps?: number; // not yet available
  net_deposit_usd?: number; // not yet available
  holders_count?: number; // not yet available
  avg_volume_usd?: number; // not yet available
  min_volatility_pct?: number; // not yet available
  top10_holder_pct?: number; // not yet available
  dev_balance_pct?: number; // not yet available
};

export type LiquidityPool = RawLiquidityPool & PoolRow;
