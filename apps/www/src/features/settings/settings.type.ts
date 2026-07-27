export type BroadcastMode = "priority-fee" | "jito-only" | "mixed";
export type PriorityLevel = "fast" | "turbo" | "ultra";
export type RebalancingType = "swap" | "swapless";

export type SlippagePreset = "0.1" | "0.5" | "1" | "custom";

export type ZapCurveType = "spot" | "curve" | "bid-ask";

export type TradingPresetId = "preset-1" | "preset-2" | "preset-3";
export type BuySellMode = "buy" | "sell";

export interface TradingConfig {
  slippage: string;
  priority: string;
  bribe: string;
  autoFee: boolean;
  maxFee: string;
  rpc: string;
}

export interface TradingPresetConfig {
  buy: TradingConfig;
  sell: TradingConfig;
}

export interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

export interface TransactionSettings {
  broadcastMode: BroadcastMode;
  priorityLevel: PriorityLevel;
  rebalancingType: RebalancingType;
}

export interface DlmmSettings {
  liquiditySlippagePreset: SlippagePreset;
  liquiditySlippageCustom: string;
  swapSlippagePreset: SlippagePreset;
  swapSlippageCustom: string;
}

export interface ZapInSettings {
  amount: string;
  liquiditySlippage: string;
  swapSlippage: string;
  swapPriceImpact: string;
  curveType: ZapCurveType;
  quoteToken: string;
}

export interface TradingSettings {
  activePreset: TradingPresetId;
  activeBuySellMode: BuySellMode;
  presets: Record<TradingPresetId, TradingPresetConfig>;
}

export interface SettingsState {
  transaction: TransactionSettings;
  dlmm: DlmmSettings;
  zapIn: ZapInSettings;
  trading: TradingSettings;
  notifications: NotificationSetting[];

  // Actions
  setTransactionSettings: (settings: Partial<TransactionSettings>) => void;
  setDlmmSettings: (settings: Partial<DlmmSettings>) => void;
  setZapInSettings: (settings: Partial<ZapInSettings>) => void;
  setTradingSettings: (
    settings: Partial<Omit<TradingSettings, "presets">>,
  ) => void;
  updateTradingConfig: (
    presetId: TradingPresetId,
    mode: BuySellMode,
    config: Partial<TradingConfig>,
  ) => void;
  toggleNotification: (id: string) => void;
  resetAllSettings: () => void;
}
