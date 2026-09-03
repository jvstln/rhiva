import { create } from "zustand";

import type { PortfolioState } from "./portfolio.type";

export const usePortfolioStore = create<PortfolioState>((set) => ({
  filter: "all",
  setFilter: (filter: string) => set({ filter }),
}));
