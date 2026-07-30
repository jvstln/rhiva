import { merge } from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";

import type {
  DlmmSettings,
  SettingsState,
  TradingConfig,
  ZapInSettings,
  TradingPresetConfig,
  TransactionSettings,
} from "./settings.type";

const defaultTradingConfig: TradingConfig = {
  slippage: 20,
};

const defaultPresetConfig: TradingPresetConfig = {
  buy: { ...defaultTradingConfig },
  sell: { ...defaultTradingConfig },
};

const defaultTransactionSettings: TransactionSettings = {
  broadcastMode: "jito-only",
  priorityLevel: "ultra",
  rebalancingType: "swap",
};

const defaultDlmmSettings: DlmmSettings = {
  liquiditySlippage: 2,
};

const defaultZapInSettings: ZapInSettings = {
  amount: 0.1,
  curveType: "Spot",
  side: "custom",
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
