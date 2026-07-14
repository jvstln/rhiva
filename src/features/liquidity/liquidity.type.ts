export type LiquidityState = {
  liquidityFilters: {
    zapIn: number | null;
  };
  setLiquidityFilters: (
    filters: Partial<LiquidityState["liquidityFilters"]>,
  ) => void;
};
