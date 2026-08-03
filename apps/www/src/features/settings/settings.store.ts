import { merge } from "lodash";
import type { WritableDraft } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import type { Strategy } from "@rhivadotfun/zap/dex/meteora";
import type { PoolDex } from "@/features/liquidity/liquidity.schema";

import type {
  LpSettings,
  SettingsState,
  TradingConfig,
  ZapInDexSettings,
  ZapInState,
  TradingPresetConfig,
  TransactionSettings,
  ZapOutSettings,
} from "./settings.type";

const defaultTradingConfig: TradingConfig = {
  slippage: 0.2,
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

const defaultLpSettings: LpSettings = {
  liquiditySlippage: 2,
};

const defaultZapInDexSettings: ZapInDexSettings = {
  amount: 0.1,
  liquiditySlippage: 0.2,
  liquiditySlippageMode: "custom",
  swapSlippage: 0.5,
  swapSlippageMode: "custom",
  binRangeMode: "custom",
  rangeFromCurrentPrice: [34, 35],
  priceChangesFromCurrentPrice: [0.1, 0.1],
  inputToken: {
    decimals: 9,
    mint: NATIVE_MINT.toBase58(),
  },
};

const defaultZapInState: Omit<
  ZapInState,
  "setDex" | "setCurveType" | "setSettings"
> = {
  dex: "meteora-dlmm",
  curveType: "Spot",
  settings: {
    "meteora-dlmm": { ...defaultZapInDexSettings },
    "orca-whirlpool": { ...defaultZapInDexSettings },
    "raydium-clmm": { ...defaultZapInDexSettings },
  },
};

const createDefaultZapInState = (
  set: (fn: (state: WritableDraft<SettingsState>) => void) => void,
): ZapInState => ({
  ...defaultZapInState,
  setDex(dex: PoolDex) {
    set((state) => {
      state.zapIn.dex = dex;
    });
  },
  setCurveType(curveType: keyof typeof Strategy) {
    set((state) => {
      state.zapIn.curveType = curveType;
    });
  },
  setSettings(settings: Partial<ZapInDexSettings>) {
    set((state) => {
      if (!state.zapIn.settings[state.zapIn.dex]) {
        state.zapIn.dex = "meteora-dlmm";
      }
      merge(state.zapIn.settings[state.zapIn.dex], settings);
    });
  },
});

const defaultZapOutSettings: ZapOutSettings = {
  liquiditySlippage: 0.2,
  outputToken: {
    mint: NATIVE_MINT.toBase58(),
    tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
  },
};

const defaultNotifications = [
  { id: "marketing", label: "Marketing & Activities", enabled: true },
  { id: "transactions", label: "Transactions", enabled: true },
  { id: "events", label: "Events Alert", enabled: true },
];

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      immer(
        (set): SettingsState => ({
          zapOut: { ...defaultZapOutSettings },
          lp: { ...defaultLpSettings },
          zapIn: createDefaultZapInState(set),
          transaction: { ...defaultTransactionSettings },
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

          setLpSettings: (settings) => {
            set((state) => {
              merge(state.lp, settings);
            });
          },

          setZapOutSettings: (settings) => {
            set((state) => {
              merge(state.zapOut, settings);
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
              const setting = state.notifications.find(
                (item) => item.id === id,
              );
              if (setting) {
                setting.enabled = !setting.enabled;
              }
            });
          },

          resetAllSettings: () => {
            set((state) => {
              state.transaction = { ...defaultTransactionSettings };
              state.lp = { ...defaultLpSettings };
              state.zapIn = createDefaultZapInState(set);
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
        }),
      ),
      {
        name: "rhiva.settings",
        merge: (persistedState, currentState) =>
          merge(currentState, persistedState),
      },
    ),
    { name: "rhiva-settings" },
  ),
);
