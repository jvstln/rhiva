import { merge } from "lodash";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  SettingsState,
  TradingConfig,
  TradingPresetConfig,
} from "./settings.type";

const defaultTradingConfig: TradingConfig = {
  slippage: "20%",
  priority: "0.001",
  bribe: "0.01",
  autoFee: false,
  maxFee: "0.01",
  rpc: "RPC https://a...e.com",
};

const defaultPresetConfig: TradingPresetConfig = {
  buy: { ...defaultTradingConfig },
  sell: { ...defaultTradingConfig },
};

const defaultTransactionSettings = {
  broadcastMode: "jito-only" as const,
  priorityLevel: "ultra" as const,
  rebalancingType: "swap" as const,
};

const defaultDlmmSettings = {
  liquiditySlippagePreset: "custom" as const,
  liquiditySlippageCustom: "3%",
  swapSlippagePreset: "custom" as const,
  swapSlippageCustom: "3%",
};

const defaultZapInSettings = {
  amount: "0.1",
  liquiditySlippage: "3 %",
  swapSlippage: "3 %",
  swapPriceImpact: "2 %",
  curveType: "spot" as const,
  quoteToken: "quote token",
};

const defaultNotifications = [
  { id: "marketing", label: "Marketing & Activities", enabled: true },
  { id: "transactions", label: "Transactions", enabled: true },
  { id: "events", label: "Events Alert", enabled: true },
];

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      immer((set) => ({
        transaction: { ...defaultTransactionSettings },
        dlmm: { ...defaultDlmmSettings },
        zapIn: { ...defaultZapInSettings },
        trading: {
          activePreset: "preset-1",
          activeBuySellMode: "buy",
          presets: {
            "preset-1": { ...defaultPresetConfig },
            "preset-2": { ...defaultPresetConfig },
            "preset-3": { ...defaultPresetConfig },
          },
        },
        notifications: [...defaultNotifications],

        setTransactionSettings: (settings) => {
          set((state) => {
            merge(state.transaction, settings);
          });
        },

        setDlmmSettings: (settings) => {
          set((state) => {
            merge(state.dlmm, settings);
          });
        },

        setZapInSettings: (settings) => {
          set((state) => {
            merge(state.zapIn, settings);
          });
        },

        setTradingSettings: (settings) => {
          set((state) => {
            merge(state.trading, settings);
          });
        },

        updateTradingConfig: (presetId, mode, config) => {
          set((state) => {
            if (!state.trading.presets[presetId]) {
              state.trading.presets[presetId] = { ...defaultPresetConfig };
            }
            merge(state.trading.presets[presetId][mode], config);
          });
        },

        toggleNotification: (id) => {
          set((state) => {
            const setting = state.notifications.find((item) => item.id === id);
            if (setting) {
              setting.enabled = !setting.enabled;
            }
          });
        },

        resetAllSettings: () => {
          set((state) => {
            state.transaction = { ...defaultTransactionSettings };
            state.dlmm = { ...defaultDlmmSettings };
            state.zapIn = { ...defaultZapInSettings };
            state.trading = {
              activePreset: "preset-1",
              activeBuySellMode: "buy",
              presets: {
                "preset-1": { ...defaultPresetConfig },
                "preset-2": { ...defaultPresetConfig },
                "preset-3": { ...defaultPresetConfig },
              },
            };
            state.notifications = [...defaultNotifications];
          });
        },
      })),
      {
        name: "rhiva.settings",
        merge: (persistedState, currentState) =>
          merge(currentState, persistedState),
      },
    ),
    { name: "rhiva-settings" },
  ),
);
