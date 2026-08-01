import { merge } from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { LiquidityState } from "./liquidity.type";
import { persist } from "zustand/middleware";

export const useLiquidityStore = create<LiquidityState>()(
  persist(
    immer(
      (set, get): LiquidityState => ({
        liquidityFilters: {
          zapIn: null,
          dex: null,
        },
        setLiquidityFilters(filters) {
          set((state) => {
            merge(state.liquidityFilters, filters);
          });
        },

        watchlist: {
          items: [],
          add(address) {
            if (get().watchlist.items.includes(address)) return;
            set((state) => {
              state.watchlist.items.push(address);
            });
          },
          remove(address) {
            if (!get().watchlist.items.includes(address)) return;

            set((state) => {
              state.watchlist.items = state.watchlist.items.filter(
                (a) => a !== address,
              );
            });
          },
          toggle(address) {
            if (get().watchlist.items.includes(address)) {
              get().watchlist.remove(address);
            } else {
              get().watchlist.add(address);
            }
          },
        },
      }),
    ),
    {
      name: "rhiva.liquidity",

      merge: (persistedState, currentState) =>
        merge(currentState, persistedState),
    },
  ),
);
