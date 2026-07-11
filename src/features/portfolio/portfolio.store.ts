import { create } from "zustand";
import type { PortfolioState } from "./portfolio.type";

export const usePortfolioStore = create<PortfolioState>((set) => ({
  liquidityFilter: "history",
  setLiquidityFilter: (filter) => set({ liquidityFilter: filter }),
}));
