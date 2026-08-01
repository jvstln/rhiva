import z from "zod";
import { feeConfig } from "@rhivadotfun/api";
import type { Strategy } from "@rhivadotfun/zap/dex/meteora";

export type RebalancingType = "swap" | "swapless";
export type PriorityLevel = "fast" | "turbo" | "ultra";
export type BroadcastMode = "priority-fee" | "jito-only" | "mixed";

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

export interface DlmmSettings {
  liquiditySlippage: number;
  swapSlippage?: number;
}

export interface ZapInSettings {
  amount: number;
  swapSlippage?: number;
  swapPriceImpact?: number;
  liquiditySlippage: number;
  curveType: keyof typeof Strategy;
  side: "base" | "quote" | "custom";
  rangeFromCurrentPrice: [number, number];
  priceChangesFromCurrentPrice: [number, number];
  inputToken: {
    mint: string;
    decimals: number;
  };
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
  dlmm: DlmmSettings;
  zapIn: ZapInSettings;
  zapOut: ZapOutSettings;
  trading: TradingSettings;
  notifications: NotificationSettings[];
  setTransactionSettings: (settings: Partial<TransactionSettings>) => void;
  setDlmmSettings: (settings: Partial<DlmmSettings>) => void;
  setZapInSettings: (settings: Partial<ZapInSettings>) => void;
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
