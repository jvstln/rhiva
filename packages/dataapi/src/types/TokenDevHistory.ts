import type { LaunchPad } from "./LaunchPad";

export type TokenDevHistory = {
  mint: string;
  creator: string | null;
  launchpad: LaunchPad;
  created_time: number;
  tokens_launched: number;
  migrated: number;
  first_launch: number;
  last_launch: number;
  scanned: number;
  truncated: boolean;
  tokens: {
    mint: string;
    name: string;
    symbol: string;
    dex: string;
    created_time: number;
    graduated: boolean;
    graduated_time: number;
    ath_usd: number;
    ath_time: number;
    ath_mcap_usd: number;
    ath_mcap_time: number;
    price_usd: number;
    liquidity_usd: number;
    holders: number;
    total_fees_usd: number;
    volume_1h_usd: number;
    bundlers_count: number;
    is_current: boolean;
  }[];
};
