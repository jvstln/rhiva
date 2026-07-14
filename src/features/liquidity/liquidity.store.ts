import { merge } from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { LiquidityState } from "./liquidity.type";

export const useLiquidityStore = create(
  immer<LiquidityState>((set) => ({
    liquidityFilters: {
      zapIn: null,
    },
    setLiquidityFilters(filters) {
      set((state) => {
        merge(state.liquidityFilters, filters);
      });
    },
  })),
);
