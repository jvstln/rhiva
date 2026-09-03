import type { WalletTag } from "./WalletTag";

export type TokenHolders = {
  mint: string;
  holders: number;
  supply: number;
  decimals: number;
  top: {
    owner: string;
    amount: number;
    pct: number;
    value_usd: number;
    first_seen: number;
    tags: WalletTag[];
    last_active: number;
    realized_usd: number;
    avg_buy_mcap_usd: number;
    avg_sell_mcap_usd: number;
    avg_hold_secs: number;
    win_rate_pct: number;
    win_rate_7d_pct: number;
    avg_duration_7d_secs: number;
    pnl_7d_usd: number;
    txs_7d: number;
  }[];
};
