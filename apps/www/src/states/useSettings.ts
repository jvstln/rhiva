import { create } from "zustand";

export enum Preset {
  Preset1 = "preset-1",
  Preset2 = "preset-2",
  Preset3 = "preset-3",
}

type State = {
  currentPreset: Preset;
  presets: Record<
    Preset,
    Record<
      "buy" | "sell",
      {
        slippage: number;
        priority: number;
        bribe: number;
        maxFee?: number;
      } | null
    >
  >;
  notifications: null;
};

type Action = {
  setCurrentPreset(preset: Preset): void;
  setPreset(preset: Preset, value: Partial<State["presets"][Preset]>): void;
};

export const useSettings = create<State & Action>((set) => ({
  notifications: null,
  currentPreset: Preset.Preset1,
  presets: {
    [Preset.Preset1]: { buy: null, sell: null },
    [Preset.Preset2]: { buy: null, sell: null },
    [Preset.Preset3]: { buy: null, sell: null },
  },
  setCurrentPreset(currentPreset) {
    set(() => ({ currentPreset }));
  },
  setPreset(preset, value) {
    set((state) => ({
      presets: {
        ...state.presets,
        [preset]: { ...state.presets[preset], ...value },
      },
    }));
  },
}));
