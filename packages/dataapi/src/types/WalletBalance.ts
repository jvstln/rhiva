import type { Chain } from "./Chain";

export type WalletBalance = {
  chain: Exclude<Chain, "sol">;
  wallet: string;
  sol: {
    amount: string;
    decimals: number;
    ui_amount: number;
    value_usd: number;
  };
  tokens: {
    mint: string;
    token_account: string;
    amount: string;
    program: "spl" | "spl-token";
    decimals: null;
    ui_amount: number;
    symbol: string;
    name: string;
    uri: string;
    price_usd: number;
    value_usd: number;
  }[];
  total_value_usd: number;
  truncated: boolean;
};
