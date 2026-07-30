import type { Timeframe } from "./market.schema";
import type { mapToken } from "./market.util";

export type Token = ReturnType<typeof mapToken>;

export type TimeframeMetrics = {
  volume_usd: number | null;
  trade_count: number;
  buy: number;
  sell: number;
  volume_buy_usd: number | null;
  volume_sell_usd: number | null;
  unique_wallet: number;
  price_change_percent: number | null;
};

export type TimeframeWindowMetrics = {
  swaps?: number;
  buys?: number;
  sells?: number;
  traders?: number;
  volume_usd?: number | null;
  volume_sol?: number | null;
  price_change_pct?: number | null;
  avg_vol_per_min_usd?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
};

export type RawTokenTimeframes = {
  created_at_ms?: number;
  age_seconds?: number;
  last_price_usd?: number;
  windows?: Record<string, TimeframeWindowMetrics>;
  fees?: {
    total_fee_sol?: number;
    avg_fee_bps?: number | null;
    total_creator_fee_sol?: number;
    avg_creator_fee_bps?: number | null;
    total_cashback_sol?: number;
    trades_with_fee?: number;
  };
};

export type RawSniperItem = {
  wallet: string;
  first_buy_slot_delta: number;
  buys_in_window: number;
  tokens_bought: number;
  sol_spent: number;
};

export type RawSnipers = {
  creation_slot: number;
  window_slots: number;
  sniper_count: number;
  snipers: RawSniperItem[];
};

export type RawBundleCluster = {
  cluster_key: string;
  kind: string;
  wallets: string[];
  combined_sol: number;
  combined_tokens: number;
  pct_of_early_sol: number;
};

export type RawBundlers = {
  creation_slot: number;
  window_slots: number;
  early_buyer_count: number;
  total_early_sol: number;
  bundle_cluster_count: number;
  bundled_wallet_count: number;
  bundled_pct_of_early_sol: number;
  clusters: RawBundleCluster[];
};

export type RawInsiders = {
  creator_wallet: string;
  creator_funder: string;
  insider_count: number;
  insiders: any[];
};

export type RawToken = {
  mint: string;
  name?: string;
  symbol?: string;
  logo_uri?: string;
  description?: string | null;
  creator?: string;
  stage?: string | null;
  recent_listing_time?: number;
  price_change_percent?: number;
  buys?: number;
  sells?: number;
  bundled_supply?: number;
  sniper_holdings?: number;
  fresh_holdings?: number;
  whale_holdings?: number;
  bot_activity?: number;
  audit_score?: number | null;
  global_fees_paid?: number | null;
  market_cap_usd?: number;
  market_cap_sol?: number;
  fdv_usd?: number;
  liquidity_usd?: number;
  price_usd?: number;

  live?: Partial<{
    txns_1m: number;
    updated_at: number;
    dexscreener_market_cap_usd: number;
    dexscreener_fdv_usd: number;
    telegram_url: string;
    dexscreener_liquidity_usd: number;
    dexscreener_price_usd: number;
    boosts_active: number;
    twitter_url: string;
    twitter_handle: string;
    website_url: string;
    price_usd: number;
    volume_1h_usd: number;
    social_updated_at: number;
    has_paid_order: number;
  }> | null;

  holders?: Partial<{
    holder_count: number;
    top10_holder_pct: number;
    dev_balance: number;
    dev_holder_pct: number;
    last_update_ms: number;
  }> | null;

  social?: Partial<{
    website_url: string;
    twitter_handle: string;
    twitter_url: string;
    telegram_url: string;
    boosts_active: number;
    has_paid_order: number;
    dexscreener_price_usd: number;
    dexscreener_liquidity_usd: number;
    dexscreener_fdv_usd: number;
    dexscreener_market_cap_usd: number;
    last_update_ms: number;
  }> | null;

  bonding?: Partial<{
    completion_pct: number | null;
    stage: string | null;
    virtual_sol_reserves?: number | null;
  }> | null;

  timeframes?: RawTokenTimeframes;

  snipers?: RawSnipers | null;
  bundlers?: RawBundlers | null;
  insiders?: RawInsiders | null;
  safety?: any | null;

  total_supply?: number;
  pair_address?: string;
  created_at?: number | null;
  pool_created_at?: number | null;
  decimals?: number;
  ath_mcap_usd?: number;
  last_surge_pct?: number;
  rank?: string;
};

export type TokenCandle = {
  t_ms: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume_usd: number;
  volume_sol: number;
  txns: number;
  buys: number;
  sells: number;
  traders: number;
};

export type TokenCandleFilters = {
  mint: string;
  timeframe: Timeframe;
  limit?: number;
};

export type RawSurgeToken = {
  mint: string;
  token_name: string;
  token_symbol: string;
  image_url: string;
  launchpad: "believe" | string;
  age_seconds: number;
  duplicate_name_count: number;
  last_surge_pct: number;
  last_direction: "up" | "down";
  entered_at_ms: number;
  entry_mcap_usd: number;
  market_cap_usd: number;
  market_cap_sol: number;
  pct_since_entry: number;
  ath_mcap_usd: number;
  ath_at_ms: number;
  pct_to_ath_from_entry: number;
  price_usd: number;
  price_sol: number;
  volume_5m_usd: number;
  volume_1h_usd: number;
  liquidity_usd: number;
  swaps_5m: number;
  swaps_1h: number;
  traders_1h: number;
  holder_count: number;
  top10_holder_pct: number;
  dev_holder_pct: number;
  dev_sold: number;
  mint_auth_disabled: number;
  freeze_auth_disabled: number;
  has_socials: number;
  website_url: string;
  twitter_handle: string;
  telegram_url: string;
  dex_boost: number;
  dex_paid: number;
  stage: string;
};
