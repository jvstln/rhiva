import type { PoolRow as SDKPoolRow, TokenDetail } from "@rhivadotfun/dataapi";

export type LiquidityState = {
  liquidityFilters: {
    zapIn: number | null;
    // dex: PoolDex | null;
    dex: SDKPoolRow["dex"] | null;
  };
  setLiquidityFilters: (
    filters: Partial<LiquidityState["liquidityFilters"]>,
  ) => void;

  watchlist: {
    items: string[];
    add: (address: string) => void;
    remove: (address: string) => void;
    toggle: (address: string) => void;
  };
};

export type PoolWithTokens = SDKPoolRow & {
  token_a: TokenDetail | undefined;
  token_b: TokenDetail | undefined;
};

export type LiquidityPool = PoolWithTokens;
