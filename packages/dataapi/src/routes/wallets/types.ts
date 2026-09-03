import type { Chain, Window } from "../../types";

export type GetWalletBalanceParams = {
  chain?: Chain;
  address: string;
  commit?: "confirmed";
};

export type GetWalletTransfersParams = {
  chain?: Chain;
  address: string;
  mint?: string;
  direction?: "in" | "out";
  before_time?: number;
  limit?: number;
};

export type GetWalletFundingParams = {
  chain?: Chain;
  address: string;
};

export type GetWalletClusterParams = {
  chain?: Chain;
  address: string;
};

export type GetWalletFeesParams = {
  chain?: Chain;
  address: string;
  window?: Window;
};

export type GetWalletPnlParams = {
  chain?: Chain;
  address: string;
  limit?: number;
};
export type GetWalletPnlTokenParams = {
  chain?: Chain;
  address: number;
  mint: number;
};

export type GetWalletSavedParams = {
  chain?: Chain;
};

export type GetWalletTradesParams = {
  address: string;
  mint?: string;
  before_time?: number;
  limit?: number;
};
