import type { Timeframe } from "./market.schema";

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

export type Token = {
  mint: string;
  live: Partial<{
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
  holders: Partial<{
    holder_count: number;
    top10_holder_pct: number;
    dev_balance: number;
    dev_holder_pct: number;
    last_update_ms: number;
  }> | null;
  social: Partial<{
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
  bonding: Partial<{
    completion_pct: number;
    stage: "new_creation" | "near_completion" | "completed";
  }> | null;

  logo_uri?: string;
  name?: string;
  symbol?: string;
  buys?: number;
  sells?: number;
  price_change_percent?: number;
  creator?: string;
  global_fees_paid?: number;
  audit_score?: number;
  bundled_supply?: number;
  whale_holdings?: number;
  sniper_holdings?: number;
  bot_activity?: number;
  recent_listing_time?: number;
  description?: string;

  // Not Available
  total_supply?: number;
  pair_address?: string;
  created_at?: number | null;
  pool_created_at?: number | null;
  /** defaulted to 9 (SOL standard) */
  decimals?: number;
  timeframes?: Partial<Record<Timeframe, TimeframeMetrics>>;
  /** All-time-high market cap in USD (when available from surge API) */
  ath_mcap_usd?: number;
  /** Last surge percent (surge-specific payload) — mapped from surge API */
  last_surge_pct?: number;
  /** Optional rank or position string from surge/radar endpoints (e.g. "8/297") */
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
