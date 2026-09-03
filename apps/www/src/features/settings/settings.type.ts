import z from "zod";
import { feeConfig } from "@rhivadotfun/api";
export type PoolDex = "meteora-dlmm" | "raydium-clmm" | "orca-whirlpool";
import type { Strategy } from "@rhivadotfun/zap/dex/meteora";

export type RebalancingType = "swap" | "swapless";
export type PriorityLevel = "fast" | "turbo" | "ultra";
export type BroadcastMode = "priority-fee" | "jito-only" | "mixed";
export type BinRangeMode = "custom" | "quote" | "base";
export type SlippageMode = "0.1" | "0.5" | "1" | "custom" | "dynamic";

export type BuySellMode = "buy" | "sell";
export type TradingPresetId = "preset-1" | "preset-2" | "preset-3";

const tradingConfigSchema = z
  .object({
    bribe: z.number().optional(),
    rpc: z.url().optional(),
    slippage: z.number().optional(),
  })
  .and(feeConfig);

export type TradingConfig = z.infer<typeof tradingConfigSchema>;

export interface TradingPresetConfig {
  buy: TradingConfig;
  sell: TradingConfig;
}

export interface NotificationSettings {
  id: string;
  label: string;
  enabled: boolean;
}
type BaseTransactionSettings = {
  rebalancingType: RebalancingType;
};

export type TransactionSettings = BaseTransactionSettings &
  (
    | (
        | {
            broadcastMode: "jito-only";
            maxFee?: number;
            priorityLevel: PriorityLevel;
          }
        | { broadcastMode: "jito-only"; exactFee: number }
      )
    | {
        priorityLevel: PriorityLevel;
        broadcastMode: Exclude<BroadcastMode, "jito-only">;
      }
  );

export interface LpSettings {
  liquiditySlippage: number;
  swapSlippage?: number;
}

export interface ZapInDexSettings {
  amount: number;
  liquiditySlippage: number;
  liquiditySlippageMode: SlippageMode;
  swapSlippage?: number;
  swapSlippageMode: SlippageMode;
  binRangeMode: BinRangeMode;
  rangeFromCurrentPrice: [number, number];
  priceChangesFromCurrentPrice: [number, number];
  inputToken: {
    mint: string;
    decimals: number;
  };
}

export interface ZapInState {
  dex: PoolDex;
  curveType: keyof typeof Strategy;
  settings: Record<PoolDex, ZapInDexSettings>;
}

export interface ZapOutSettings {
  swapSlippage?: number;
  liquiditySlippage: number;
  outputToken: {
    mint: string;
    tokenProgram: string;
  };
}

export interface TradingSettings {
  activePreset: TradingPresetId;
  activeBuySellMode: BuySellMode;
  presets: Record<TradingPresetId, TradingPresetConfig>;
}

export interface SettingsState {
  transaction: TransactionSettings;
  lp: LpSettings;
  zapIn: ZapInState;
  zapOut: ZapOutSettings;
  trading: TradingSettings;
  notifications: NotificationSettings[];
  setTransactionSettings: (settings: Partial<TransactionSettings>) => void;
  setLpSettings: (settings: Partial<LpSettings>) => void;
  setZapInSettings: (settings: Partial<ZapInState>) => void;
  setZapOutSettings: (settings: Partial<ZapOutSettings>) => void;
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
