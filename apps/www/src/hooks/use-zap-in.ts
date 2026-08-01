import type z from "zod";
import { useCallback, useMemo } from "react";
import { Strategy } from "@rhivadotfun/zap/dex/meteora";
import type { jitoConfigSchema } from "@rhivadotfun/api";

import { useUserApi } from "./use-user-api";
import { useSettingsStore } from "@/features/settings/settings.store";
import { toJitoPriorityLevel } from "@/features/settings/settings.util";

type ZapInParams = {
  pool: string;
  amount?: number;
  dex: "meteora-dlmm" | "orca" | "raydium-clmm";
};

export const useZapIn = (params: ZapInParams) => {
  const userApi = useUserApi();
  const [zapInSettings, transactionSettings] = useSettingsStore((store) => [
    store.zapIn,
    store.transaction,
  ]);

  const jitoConfig: z.infer<typeof jitoConfigSchema> = useMemo(() => {
    if (transactionSettings.broadcastMode === "jito-only")
      return "exactFee" in transactionSettings
        ? { feeMode: "exact", exactFee: transactionSettings.exactFee }
        : {
            feeMode: "dynamic",
            maxFee: transactionSettings.maxFee,
            priorityLevel: toJitoPriorityLevel(
              transactionSettings.priorityLevel,
            ),
          };
    return {
      feeMode: "dynamic",
      priorityLevel: toJitoPriorityLevel(transactionSettings.priorityLevel),
    };
  }, [transactionSettings]);

  return useCallback(() => {
    const rawAmount = params.amount ? params.amount : zapInSettings.amount;
    const [minDeltaId, maxDeltaId] = zapInSettings.rangeFromCurrentPrice;
    const slippage = {
      liquidity: zapInSettings.liquiditySlippage,
      swap: zapInSettings.swapSlippage
        ? zapInSettings.swapSlippage
        : ("dynamic" as const),
    };

    const inputMint = zapInSettings.inputToken.mint;
    const inputDecimals = zapInSettings.inputToken.decimals;

    const amount = rawAmount * Math.pow(10, inputDecimals);

    switch (params.dex) {
      case "meteora-dlmm": {
        const liquidityRatio: [number, number] =
          minDeltaId === 0 ? [0, 1] : maxDeltaId === 0 ? [1, 0] : [0.5, 0.5];

        return userApi.transaction.dex.meteora.dlmm.buildTransaction({
          amount,
          slippage,
          minDeltaId,
          maxDeltaId,
          inputMint,
          inputDecimals,
          jitoConfig,
          liquidityRatio,
          pool: params.pool,
          action: "open-position",
          strategy: Strategy[zapInSettings.curveType],
        });
      }
      case "orca": {
        const [lowerPriceChange, upperPriceChange] =
          zapInSettings.priceChangesFromCurrentPrice;
        const priceChange = lowerPriceChange + upperPriceChange;
        const xRatio = lowerPriceChange / priceChange;
        const yRatio = upperPriceChange / priceChange;

        const liquidityRatio: [number, number] =
          lowerPriceChange === 0
            ? [0, 1]
            : upperPriceChange === 0
              ? [1, 0]
              : [xRatio, yRatio];

        return userApi.transaction.dex.orca.whirlpool.buildTransaction({
          amount,
          slippage,
          inputMint,
          inputDecimals,
          jitoConfig,
          liquidityRatio,
          pool: params.pool,
          action: "open-position",
          priceChanges: zapInSettings.priceChangesFromCurrentPrice,
        });
      }
      case "raydium-clmm":
        return userApi.transaction.dex.raydium.clmm.buildTransaction({
          amount,
          slippage,
          inputMint,
          inputDecimals,
          jitoConfig,
          pool: params.pool,
          action: "open-position",
          priceChanges: zapInSettings.priceChangesFromCurrentPrice,
        });
    }
  }, [params, userApi, zapInSettings, jitoConfig]);
};
