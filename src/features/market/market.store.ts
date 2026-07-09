import { merge } from "lodash";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { MarketState } from "./market.type";

export const useMarketStore = create<MarketState>()(
  devtools(
    persist(
      immer((set) => ({
        radarSettings: {
          quickSell: {
            fresh: {
              unit: "percent",
              value: 0,
            },
            heatingUp: {
              unit: "percent",
              value: 0,
            },
            graduated: {
              unit: "percent",
              value: 0,
            },
          },
          setQuickSell(columns) {
            set((state) => {
              merge(state.radarSettings.quickSell, columns);
            });
          },
        },
        trendingSettings: {
          quickSell: {
            unit: "percent",
            value: 0,
          },
          setQuickSell(settings) {
            set((state) => {
              merge(state.trendingSettings.quickSell, settings);
            });
          },
          quickBuy: 0,
        },
        pumpLiveSettings: {
          sort: {
            marketCap: null,
            time: null,
          },
          setSort(columns) {
            set((state) => {
              merge(
                state.pumpLiveSettings.sort,
                typeof columns === "function"
                  ? columns(state.pumpLiveSettings.sort)
                  : columns,
              );
            });
          },
        },
      })),
      {
        name: "rhiva-market",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: "rhiva-market" },
  ),
);
