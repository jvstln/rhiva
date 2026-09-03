import type { Chain, Dex, LaunchPad, WalletTag } from "../../types";
import type { Window } from "../../types/Window";

export type GetMetadataParams = {
  chain?: Chain;
  address: string;
};

export type GetMetadataMultiParams = {
  chain?: Chain;
  addresses: string[];
};

export type GetTokenParams = {
  chain?: Chain;
  address: string;
  sniper_slots?: number;
};

export type GetTokenCreationParams = {
  chain?: Chain;
  address: string;
};

export type GetTokenStatsParams<T> = {
  chain?: Chain;
  enrich: true;
  address: string;
  windows: T[];
};

export type GetTokenAthParams = {
  chain?: Chain;
  address: string;
};

export type GetTokenSupplyParams = {
  chain?: Chain;
  address: string;
};

export type GetTokenSecurityParams = {
  chain?: Chain;
  address: string;
};

export type GetTokenRiskIntelParams = {
  chain?: Chain;
  address: string;
};

export type GetTokenDevHistoryParams = {
  chain?: Chain;
  address: string;
  limit?: number;
};

export type GetTokenDuplicatesParams = {
  chain?: Chain;
  address: string;
  limit?: number;
};

export type GetTokenPoolsParams = {
  chain?: Chain;
  address: string;
  limit?: number;
};

export type GetTokenHoldersParams = {
  chain?: Chain;
  address: string;
  limit?: number;
  labels?: WalletTag[];
};

export type GetTokenHoldersChartParams = {
  chain?: Chain;
  address: string;
  interval?: "1h";
  from?: number;
  to?: number;
};

export type GetTokenFirstBuyersParams = {
  chain?: Chain;
  address: string;
};

export type GetTopTradersParams = {
  chain?: Chain;
  address: string;
  sort: "realized";
  labels?: WalletTag[];
  limit?: number;
};

export type GetTokenFeesParams = {
  chain?: Chain;
  address: string;
  window?: "86400";
};

export type SearchTokenParams = {
  chain?: Chain;
  q: string;
  limit?: boolean;
};

export type GetLaunchesParams = {
  chain?: Chain;
  limit?: number;
  before_time?: number;
};

export type GetGraduatingParams = {
  chain?: Chain;
  limit?: number;
  min_progress_pct?: number;
};

export type GetGraduatedParams = {
  chain?: Chain;
  limit?: number;
  before_time?: number;
  launchpad: LaunchPad;
};

export type GetTrendingParams = {
  chain?: Chain;
  window?: Window;
  sort?: "volume";
  min_liquidity_usd?: number;
  limit?: number;
};

export type GetMoversParams = {
  chain?: Chain;
  limit?: number;
  direction?: "gainers" | "losers";
  min_volume_usd?: number;
  max_volume_usd?: number;
};

export type GetTokensParams = {
  chain?: Chain;
  sort: "volume_usd" | "trades" | "traders" | "price_chnage_pct";
  window?: Window;
  order?: "desc" | "asc";
  limit?: number;
  min_volume_usd?: number;
  max_volume_usd?: number;
  min_trades?: number;
  max_trades?: number;
  min_traders?: number;
  max_traders?: number;
  min_price_change_pct?: number;
  max_price_change_pct?: number;
  min_liquidity_usd?: number;
};

export type GetScreenerParams = {
  chain?: Chain;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "desc" | "asc";
  min_mcap_usd?: number;
  max_mcap_usd?: number;
  min_liquidity_usd?: number;
  min_volume_usd?: number;
  min_holdsers?: number;
  min_top10_pct?: number;
  min_dev_pct?: number;
  min_bot_volume_pct?: number;
  min_organic_score?: number;
  min_bonding_pct?: number;
  min_age_secs?: number;
  min_sniper_pct?: number;
  min_insider_pct?: number;
  min_bundler_pct?: number;
  min_fresh_pct?: number;
  min_pro_traders?: number;
  min_dev_sold_usd?: number;
  min_reused_symbol_count?: number;
  min_dev_migrations?: number;
  is_graduated?: number;
  is_rug?: number;
  has_socials?: number;
  has_website?: number;
  has_x?: number;
  has_telegram?: number;
  has_social_update?: number;
  mint_auth_disabled?: number;
  freeze_auth_disabled?: number;
  dex?: Dex;
  launchpad?: LaunchPad;
  category?: string;
  creator?: string;
};

export type GetTokenPriceParams = {
  chain?: Chain;
  address: string;
  liquidity: boolean;
};

export type GetTokenPriceMultiParams = {
  chain?: Chain;
  addresses: string[];
  liquidity: boolean;
};

export type GetTokenPriceHistoryParams = {
  chain?: Chain;
  address: string;
  from: number;
  to: number;
  interval: "1h";
  denom?: "usd";
};

export type GetTokenPriceAtParams = {
  chain?: Chain;
  address: string;
  time: string;
};

export type GetTokenOhlvcParams = {
  chain?: Chain;
  address: string;
  interval?: "1m";
  from?: number;
  to?: number;
  count?: number;
  denom?: "usd";
  pool?: string;
};

export type GetTokenLiquidityParams = {
  chain?: Chain;
  address: string;
  interval?: "1m";
  from?: number;
  to?: number;
  pool?: string;
};

export type GetTokenTradesParams = {
  chain?: Chain;
  address: string;
  pool?: string;
  trader?: string;
  side?: "buy" | "sell";
  min_volume_usd?: number;
  before_time?: number;
  after_time?: number;
  before_tx_index?: number;
  before_ix_index?: number;
  limit?: number;
};

export type GetRecentTradesParams = {
  chain?: Chain;
  dex?: Dex;
  limit?: number;
};

export type GetWhaleTradesParams = {
  chain?: Chain;
  limit?: number;
  window?: number;
  min_volume_usd?: number;
};
