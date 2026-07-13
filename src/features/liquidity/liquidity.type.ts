export type LiquidityState = {
  liquidityFilters: {
    apeIn: number | null;
  };
  setLiquidityFilters: (
    filters: Partial<LiquidityState["liquidityFilters"]>,
  ) => void;
};
