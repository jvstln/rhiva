import { merge } from "lodash";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { MarketState } from "./market.type";

export const useMarketStore = create<MarketState>()(
  persist(
    immer(
      (set, get): MarketState => ({
        radarFilters: {
          fresh: {
            search: "",
            preset: "p1",
            quickBuy: 0,
            quickSell: null,
          },
          heatingUp: {
            search: "",
            preset: "p1",
            quickBuy: 0,
            quickSell: null,
          },
          graduated: {
            search: "",
            preset: "p1",
            quickBuy: 0,
            quickSell: null,
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
          quickSell: null,
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
          quickBuy: null,
          preset: "p1",
        },
        setSurgeFilters(filters) {
          set((state) => {
            merge(state.surgeFilters, filters);
          });
        },
        // ------------------------------------------------------------------------

        watchlist: {
          items: [],
          add(mint) {
            if (get().watchlist.items.includes(mint)) return;
            set((state) => {
              state.watchlist.items.push(mint);
            });
          },
          remove(mint) {
            if (!get().watchlist.items.includes(mint)) return;

            set((state) => {
              state.watchlist.items = state.watchlist.items.filter(
                (m) => m !== mint,
              );
            });
          },
          toggle(mint) {
            if (get().watchlist.items.includes(mint)) {
              get().watchlist.remove(mint);
            } else {
              get().watchlist.add(mint);
            }
          },
        },
      }),
    ),
    {
      name: "rhiva.market",
      merge: (persistedState, currentState) =>
        merge(currentState, persistedState),
    },
  ),
);
