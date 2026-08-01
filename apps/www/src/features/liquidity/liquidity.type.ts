import type { Token } from "../market/market.token.type";
import type { mapLiquidityPool } from "./liquidity.util";
import type { Timeframe } from "../market/market.schema";
import type { PoolDex } from "./liquidity.schema";

export type LiquidityState = {
  liquidityFilters: {
    zapIn: number | null;
    dex: PoolDex | null;
  };
  setLiquidityFilters: (
    filters: Partial<LiquidityState["liquidityFilters"]>,
  ) => void;

  watchlist: {
    items: string[];
    add: (address: string) => void;
    remove: (address: string) => void;
    toggle: (address: string) => void;
  };
};

export type RawLiquidityPool = Partial<{
  pool_address: string;
  dex: string;
  token_mint_a: string;
  token_mint_b: string;
  token_a?: Token;
  token_b?: Token;
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
  market_cap_usd?: number;
  active_tvl_usd?: number;
  market_cap_change_pct?: number;
  tvl_change_pct?: number;
  active_tvl_change_pct?: number;
  fees_ratio?: number;
  fees_ratio_change_pct?: number;
  volume_change_pct?: number;
  volume_ratio?: number;
  volume_ratio_change_pct?: number;
  swaps_24h?: number;
  traders_24h?: number;
  total_lps?: number;
  net_deposit_usd?: number;
  holders_count?: number;
  avg_volume_usd?: number;
  min_volatility_pct?: number;
  top10_holder_pct?: number;
  dev_balance_pct?: number;

  base_symbol?: string;
  price_usd: number | null;
  price_change_1h_pct: number | null;
  price_change_24h_pct: number | null;
  tvl_usd?: number;

  // Extra properties for liquidity details
  collect_fee_mode: number;
  base_mint: string;
  base_usd: number;
  quote_usd: number;
  open_positions: number;
  in_range_positions: number;
  price_change_5m_pct: number;
  age_seconds: number;
  mint_auth_disabled: number;
  freeze_auth_disabled: number;
  has_permanent_delegate: number;
  has_transfer_hook: number;
  token_stats: {
    created_at_ms: number;
    age_seconds: number;
    last_price_usd: number;
    windows: Record<
      Timeframe,
      {
        swaps: number;
        buys: number;
        sells: number;
        traders: number;
        volume_usd: number;
        volume_sol: number;
        price_change_pct: number;
        avg_vol_per_min_usd: number;
        open: number;
        high: number;
        low: number;
        close: number;
      }
    >;
    fees: {
      total_fee_sol: number;
      avg_fee_bps: number;
      total_creator_fee_sol: number;
      avg_creator_fee_bps: null;
      total_cashback_sol: number;
      trades_with_fee: number;
    };
  };
  token_safety: {
    token_program: string;
    mint_authority_renounced: number;
    freeze_authority_renounced: number;
    has_permanent_delegate: number;
    has_transfer_hook: number;
    has_transfer_fee: number;
    non_transferable: number;
    has_default_account_state_ext: number;
    checked_at_ms: number;
  };
  token_snipers: {
    creation_slot: number;
    window_slots: number;
    sniper_count: number;
  };
  token_bundlers: {
    creation_slot: number;
    window_slots: number;
    early_buyer_count: number;
    total_early_sol: number;
    bundle_cluster_count: number;
    bundled_wallet_count: number;
    bundled_pct_of_early_sol: number;
  };
  token_insiders: {
    creator_wallet: string;
    creator_funder: "";
    insider_count: number;
  };
  fees_usd: number;
  fees_change_pct: null;
  avg_fees_per_min_usd: number;
  tvl_distribution: {
    base_usd: number;
    base_pct: number;
    quote_usd: number;
    quote_pct: number;
  };
  total_lps_change_pct: null;
  new_lps: null;
  positions_created: null;
  net_deposit_split: null;
  volatility_pct: number;
  liquidity_distribution: null;
  max_fee_pct: string;
  limit_order_bonus_pct: null;
  fee_collection_token: string;
}>;

export type LiquidityPool = ReturnType<typeof mapLiquidityPool>;
