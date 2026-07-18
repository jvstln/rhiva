export interface TrendingTokenResponseData {
  items: TrendingToken[];
  has_next: boolean;
}

export interface TrendingToken {
  address: string;
  logo_uri: string | null;
  name: string;
  symbol: string;
  decimals: number;
  extensions?: TrendingTokenExtensions;
  market_cap: number;
  fdv: number;
  total_supply: number;
  circulating_supply: number;
  liquidity: number;
  last_trade_unix_time: number;
  volume_1m_usd: number;
  volume_5m_usd: number;
  volume_30m_usd: number;
  volume_1m_change_percent: number | null;
  volume_5m_change_percent: number | null;
  volume_30m_change_percent: number | null;
  volume_1h_usd: number;
  volume_1h_change_percent: number | null;
  volume_2h_usd: number;
  volume_2h_change_percent: number | null;
  volume_4h_usd: number;
  volume_4h_change_percent: number | null;
  volume_8h_usd: number;
  volume_8h_change_percent: number | null;
  volume_24h_usd: number;
  volume_24h_change_percent: number | null;
  volume_7d_usd: number;
  volume_7d_change_percent: number | null;
  volume_30d_usd: number;
  volume_30d_change_percent: number | null;
  trade_1m_count: number;
  trade_5m_count: number;
  trade_30m_count: number;
  trade_1h_count: number;
  trade_2h_count: number;
  trade_4h_count: number;
  trade_8h_count: number;
  trade_24h_count: number;
  trade_7d_count: number;
  trade_30d_count: number;
  buy_24h: number;
  buy_24h_change_percent: number | null;
  volume_buy_24h_usd: number;
  volume_buy_24h_change_percent: number | null;
  buy_7d: number;
  buy_7d_change_percent: number | null;
  volume_buy_7d_usd: number;
  volume_buy_7d_change_percent: number | null;
  buy_30d: number;
  buy_30d_change_percent: number | null;
  volume_buy_30d_usd: number;
  volume_buy_30d_change_percent: number | null;
  sell_24h: number;
  sell_24h_change_percent: number | null;
  volume_sell_24h_usd: number;
  volume_sell_24h_change_percent: number | null;
  sell_7d: number;
  sell_7d_change_percent: number | null;
  volume_sell_7d_usd: number;
  volume_sell_7d_change_percent: number | null;
  sell_30d: number;
  sell_30d_change_percent: number | null;
  volume_sell_30d_usd: number;
  volume_sell_30d_change_percent: number | null;
  unique_wallet_24h: number;
  unique_wallet_24h_change_percent: number | null;
  price: number;
  price_change_1m_percent: number | null;
  price_change_5m_percent: number | null;
  price_change_30m_percent: number | null;
  price_change_1h_percent: number | null;
  price_change_2h_percent: number | null;
  price_change_4h_percent: number | null;
  price_change_8h_percent: number | null;
  price_change_24h_percent: number | null;
  price_change_7d_percent: number | null;
  price_change_30d_percent: number | null;
  holder: number;
  recent_listing_time: number | null;
  is_scaled_ui_token: boolean;
  multiplier: number | null;
  global_fees_paid: number;
}

export interface TrendingTokenExtensions {
  coingecko_id?: string;
  serum_v3_usdc?: string | null;
  serum_v3_usdt?: string | null;
  website?: string | null;
  telegram?: string | null;
  twitter?: string | null;
  description?: string | null;
  discord?: string | null;
  medium?: string | null;
  github?: string | null;
  // [key: string]: string | null | undefined; // Allow other extension fields
}

// ============================================================
// Meme token for radar view
// ============================================================

export interface MemeTokenResponseData {
  items: MemeToken[];
  has_next: boolean;
}

export interface MemeToken {
  // --- Core Fields (same as before) ---
  address: string;
  logo_uri: string | null;
  name: string;
  symbol: string;
  decimals: number;
  extensions: MemeExtensions;

  market_cap: number;
  fdv: number;
  total_supply: number;
  circulating_supply: number;
  liquidity: number;
  last_trade_unix_time: number;

  // --- Volume ---
  volume_1m_usd: number;
  volume_5m_usd: number;
  volume_30m_usd: number;
  volume_1m_change_percent: number | null;
  volume_5m_change_percent: number | null;
  volume_30m_change_percent: number | null;
  volume_1h_usd: number;
  volume_1h_change_percent: number | null;
  volume_2h_usd: number;
  volume_2h_change_percent: number | null;
  volume_4h_usd: number;
  volume_4h_change_percent: number | null;
  volume_8h_usd: number;
  volume_8h_change_percent: number | null;
  volume_24h_usd: number;
  volume_24h_change_percent: number | null;
  volume_7d_usd: number;
  volume_7d_change_percent: number | null;
  volume_30d_usd: number;
  volume_30d_change_percent: number | null;

  // --- Trade Counts ---
  trade_1m_count: number;
  trade_5m_count: number;
  trade_30m_count: number;
  trade_1h_count: number;
  trade_2h_count: number;
  trade_4h_count: number;
  trade_8h_count: number;
  trade_24h_count: number;
  trade_7d_count: number;
  trade_30d_count: number;

  // --- Buy Stats ---
  buy_24h: number;
  buy_24h_change_percent: number | null;
  volume_buy_24h_usd: number;
  volume_buy_24h_change_percent: number | null;
  buy_7d: number;
  buy_7d_change_percent: number | null;
  volume_buy_7d_usd: number;
  volume_buy_7d_change_percent: number | null;
  buy_30d: number;
  buy_30d_change_percent: number | null;
  volume_buy_30d_usd: number;
  volume_buy_30d_change_percent: number | null;

  // --- Sell Stats ---
  sell_24h: number;
  sell_24h_change_percent: number | null;
  volume_sell_24h_usd: number;
  volume_sell_24h_change_percent: number | null;
  sell_7d: number;
  sell_7d_change_percent: number | null;
  volume_sell_7d_usd: number;
  volume_sell_7d_change_percent: number | null;
  sell_30d: number;
  sell_30d_change_percent: number | null;
  volume_sell_30d_usd: number;
  volume_sell_30d_change_percent: number | null;

  // --- Wallets ---
  unique_wallet_24h: number;
  unique_wallet_24h_change_percent: number | null;

  // --- Price ---
  price: number;
  price_change_1m_percent: number | null;
  price_change_5m_percent: number | null;
  price_change_30m_percent: number | null;
  price_change_1h_percent: number | null;
  price_change_2h_percent: number | null;
  price_change_4h_percent: number | null;
  price_change_8h_percent: number | null;
  price_change_24h_percent: number | null;
  price_change_7d_percent: number | null;
  price_change_30d_percent: number | null;

  // --- Other ---
  holder: number;
  recent_listing_time: number | null;
  global_fees_paid: number;

  // ============================================================
  // 🆕 NEW FIELD: Meme Info (only present for meme tokens)
  // ============================================================
  meme_info: MemeInfo;
}

// ============================================================
// Extensions (same as before, but can be empty)
// ============================================================

export interface MemeExtensions {
  coingecko_id?: string;
  serum_v3_usdc?: string | null;
  serum_v3_usdt?: string | null;
  website?: string | null;
  telegram?: string | null;
  twitter?: string | null;
  description?: string | null;
  discord?: string | null;
  medium?: string | null;
  github?: string | null;
  // [key: string]: string | null | undefined;
}

// ============================================================
// 🆕 Meme Info Structure
// ============================================================

export interface MemeInfo {
  created_at: MemeCreation;
  creator: string;
  address: string;
  creation_time: number;
  graduated: boolean;
  pool: MemePool;
  progress_percent: number;
  source: string; // e.g., "pump_dot_fun"
  platform_id: string;
  graduated_time: number | null;
}

export interface MemeCreation {
  block_time: number;
  slot: number;
  tx_hash: string;
}

export interface MemePool {
  address: string;
  real_sol_reserves: string; // stored as string (big integer)
  real_token_reserves: string; // stored as string (big integer)
  virtual_token_reserves: string; // stored as string (big integer)
  token_total_supply: string; // stored as string (big integer)
}
