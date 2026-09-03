import type { Chain, Dex, Interval, Window } from "../../types";

export type GetPoolsParams = {
  chain?: Chain;
  window?: string;
  sort?:
    | "liquidity_usd"
    | "tvl_usd"
    | "volume_usd"
    | "fees_usd"
    | "trades"
    | "traders"
    | "price_change_pct"
    | "fee_tvl_pct"
    | "volume_pct"
    | "net_deposit_usd"
    | "providers";
  order?: "desc" | "asc";
  address?: string[] | string;
  dex?: Dex[] | Dex;
  q?: string;
  limit?: number;
  offset?: number;
};

export type GetPoolParams<T extends Window> = {
  chain?: Chain;
  address: string;
  windows?: T | T[];
};

export type GetPoolTvlParams = {
  chain?: Chain;
  address: string;
  window?: Window;
  interval?: Interval;
};
