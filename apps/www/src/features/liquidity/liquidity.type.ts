import type { PoolRow as SDKPoolRow, TokenDetail } from "@rhivadotfun/dataapi";
import type { getLiquidityPool } from "./liquidity.api";
import type { LiquidityPoolFilters } from "./liquidity.schema";

export type LiquidityState = {
  liquidityFilters: LiquidityPoolFilters & {
    zapIn: number | null;
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

export type LiquidityPool = Awaited<ReturnType<typeof getLiquidityPool>>;
