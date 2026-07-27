import { create } from "zustand";
import type { AuthStore } from "./auth.type";

export const useAuthStore = create<AuthStore>()((set) => ({
  view: null,
  setView: (view) => set({ view }),
}));
