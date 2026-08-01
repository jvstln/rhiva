import type { PoolRow as SDKPoolRow, TokenDetail } from "@rhivadotfun/dataapi";

export type LiquidityState = {
  liquidityFilters: {
    zapIn: number | null;
  };
  setLiquidityFilters: (
    filters: Partial<LiquidityState["liquidityFilters"]>,
  ) => void;
};

export type PoolWithTokens = SDKPoolRow & {
  token_a: TokenDetail | undefined;
  token_b: TokenDetail | undefined;
};

export type LiquidityPool = PoolWithTokens;
