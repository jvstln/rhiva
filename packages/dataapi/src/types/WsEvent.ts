import type { Dex } from "./Dex";
import type { LaunchPad } from "./LaunchPad";

export type WsSwapEvent = {
  type: "swap";
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  dex: Dex;
  pool: string;
  mint: string;
  quote_mint: string;
  trader: string;
  side: "buy" | "sell";
  base_amount: number;
  quote_amount: number;
  base_decimals: number;
  quote_decimals: number;
  base_reserve: number;
  quote_reserve: number;
  fee_amount: number;
  fee_mint: string;
  fee_pct: number;
  fee_paid_out: number;
  price_impact_pct: number;
  price: number;
  price_usd: number;
  volume_usd: number;
  candle_ok: boolean;
  indexed_at: number;
  virtual_base_reserve: number;
  virtual_quote_reserve: number;
};

export type WsLiquidityEvent = {
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  inner_ix_index: number;
  dex: Dex;
  pool: string;
  kind: "add" | "remove";
  provider: string;
  base_mint: string;
  quote_mint: string;
  base_amount: number;
  quote_amount: number;
  base_decimals: number;
  quote_decimals: number;
  base_reserve: number;
  quote_reserve: number;
  base_usd: number;
  quote_usd: number;
  indexed_at: number;
  type: "liquidity";
};

export type WsTokenCreateEvent = {
  kind: "token";
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  inner_ix_index: number;
  dex: Dex;
  mint: string;
  pool: string;
  base_mint: string;
  quote_mint: string;
  name: string;
  symbol: string;
  uri: string;
  creator: string;
  indexed_at: number;
  type: "token_create";
};

export type WsPoolCreateEvent = {
  kind: "pool";
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  inner_ix_index: number;
  dex: Dex;
  mint: string;
  pool: string;
  base_mint: string;
  quote_mint: string;
  name: string;
  symbol: string;
  uri: string;
  creator: string;
  indexed_at: number;
  type: "pool_create";
};

export type WsTransferEvent = {
  kind: "transfer";
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  inner_ix_index: number;
  mint: string;
  src_owner: string;
  dst_owner: string;
  amount: number;
  decimals: number;
  indexed_at: number;
  type: "transfer";
};

export type WsCandleEvent = {
  mint: string;
  pool: string;
  interval: "1m";
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
  closed: boolean;
  type: "candle";
};

export type WsStatsEvent = {
  type: "stats";
  mint: string;
  price_usd: number;
  block_time: number;
  windows: Record<
    300 | 3600,
    {
      volume_usd: number;
      trades: number;
      buys: number;
      sells: number;
      price_change_pct: number;
    }
  >;
};

export type WsMemeEvent = {
  mint: string;
  launchpad: LaunchPad;
  metadata: {
    name: string;
    symbol: string;
    uri: string;
    creator: string | null;
    decimals: number;
    suppy: number;
    logo_uri: string;
    descriprion: string;
    socials: {
      website: string | null;
      x: string | null;
      telegram: string | null;
      discord: string | null;
      youtube: string | null;
      instagram: string | null;
      tiktok: null;
    };
  };
  creator: string;
  created_time: number;
  graduated: false;
  progress_pct: number;
  price_usd: number;
  base_reserve: number;
  quote_reserve: number;
  block_time: number;
  windows: Record<
    300 | 3600,
    {
      volume_usd: number;
      trades: number;
      buys: number;
      sells: number;
      price_change_pct: number;
    }
  >;
  type: "meme";
};

export type WsGraduationEvent = {
  mint: string;
  launchpad: LaunchPad;
  creator: string;
  created_time: number;
  pool: string;
  dex: Dex;
  slot: number;
  block_time: number;
  type: "graduation";
};

export type WsSurgeEvent = {
  mint: string;
  trigger_time: number;
  mcap_at_trigger: number;
  price_at_trigger: number;
  volume_window_usd: number;
  baseline_usd: number;
  multiple: number;
  trades: number;
  traders_est: number;
  window_secs: number;
  type: "surge";
};

export type WsRadarEvent = {
  mint: string;
  trigger_time: number;
  mcap_at_trigger: number;
  price_at_trigger: number;
  volume_window_usd: number;
  baseline_usd: number;
  multiple: number;
  trades: number;
  traders_est: number;
  window_secs: number;
  type: "radar";
};

export type WsEvent =
  | WsSwapEvent
  | WsLiquidityEvent
  | WsTokenCreateEvent
  | WsPoolCreateEvent
  | WsTransferEvent
  | WsCandleEvent
  | WsStatsEvent
  | WsMemeEvent
  | WsGraduationEvent
  | WsSurgeEvent
  | WsRadarEvent;
