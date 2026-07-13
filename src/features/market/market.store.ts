import { merge } from "lodash";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { MarketState } from "./market.type";

export const useMarketStore = create<MarketState>()(
  devtools(
    persist(
      immer(
        (set): MarketState => ({
          radarFilters: {
            fresh: {
              search: "",
              bondingCurve: "p1",
              quickBuy: 0,
              quickSell: 0,
            },
            heatingUp: {
              search: "",
              bondingCurve: "p1",
              quickBuy: 0,
              quickSell: 0,
            },
            graduated: {
              search: "",
              bondingCurve: "p1",
              quickBuy: 0,
              quickSell: 0,
            },
          },
          setRadarFilters(columns) {
            set((state) => {
              merge(state.radarFilters, columns);
            });
          },

          // ------------------------------------------------------------------------
          trendingFilters: {
            timeframe: "1h",
            quickSell: 0,
            quickBuy: 0,
            preset: "p1",
          },
          setTrendingFilters(filters) {
            set((state) => {
              merge(state.trendingFilters, filters);
            });
          },
          // ------------------------------------------------------------------------

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

          // ------------------------------------------------------------------------
          surgeFilters: {
            timeframe: "1h",
            mcMin: null,
            mcMax: null,
            quickBuy: null,
            preset: "p1",
          },
          setSurgeFilters(filters) {
            set((state) => {
              merge(state.surgeFilters, filters);
            });
          },
          // ------------------------------------------------------------------------
        }),
      ),
      {
        name: "rhiva.market",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: "rhiva-market" },
  ),
);
