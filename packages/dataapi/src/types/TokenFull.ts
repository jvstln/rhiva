import type { Window } from "./Window";
import type { FeeVenue } from "./FeeVenue";
import type { LaunchPad } from "./LaunchPad";

export type TokenFull = {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  uri: string | null;
  image: string | null;
  description: null;
  socials: {
    website: string | null;
    x: string | null;
    telegram: string | null;
    discord: string | null;
    youtube: string | null;
    instagram: string | null;
    tiktok: string | null;
  };
  launchpad: LaunchPad | null;
  creator: string | null;
  created_slot: number | null;
  created_time: number | null;
  price_usd: number;
  price_native: number;
  quote_mint: string;
  supply: number;
  market_cap_usd: number;
  fdv_usd: number;
  holders: number;
  top10_pct: number;
  pools: [];
  stats: Record<
    Window,
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
  intel: {
    mint: string;
    score: number;
    rugged: boolean;
    flags: {
      name: string;
      level: "warning";
      detail: string;
    }[];
    dev: {
      wallets: number;
      held: number;
      initial: number;
      held_pct: number;
      initial_pct: number;
    };
    snipers: {
      wallets: number;
      held: number;
      initial: number;
      held_pct: number;
      initial_pct: number;
    };
    bundlers: {
      wallets: number;
      held: number;
      initial: number;
      held_pct: number;
      initial_pct: number;
    };
    insiders: {
      wallets: number;
      held: number;
      initial: number;
      held_pct: number;
      initial_pct: number;
    };
    fees: {
      total_sol: number;
      total_usd: number;
      tips_usd: number;
      trading_usd: number;
      total_paid_usd: number;
      venues: Record<FeeVenue, { sol: number; usd: number }>;
    };
  } | null;
  screener: {
    bonding_pct: number;
    is_graduated: boolean;
    organic_score: number | null;
    dev_pct: number;
    net_buy_usd: number;
    fees_usd: number;
    launchpad: LaunchPad | null;
    socials: {
      any: boolean;
      website: boolean;
      x: boolean;
      telegram: boolean;
    };
  } | null;
  dev: {
    wallet: string | null;
    tokens_launched: number;
  };
  ath_mcap_usd: number | null;
  indexed_from_creation: boolean;
  history_from: boolean;
  surge: {
    trigger_time: number;
    mcap_at_trigger: number;
    multiple: number;
    mcap_change_since_trigger_pct: number;
    ath_change_since_trigger_pct: number;
  } | null;
  liquidity_usd: number;
  tvl_usd: number;
};
