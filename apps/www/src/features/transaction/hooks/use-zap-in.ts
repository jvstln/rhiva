import type z from "zod";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Strategy } from "@rhivadotfun/zap/dex/meteora";
import type { jitoConfigSchema } from "@rhivadotfun/api";

import { useUserApi } from "../../../hooks/use-user-api";
import { useSettingsStore } from "@/features/settings/settings.store";
import { toJitoPriorityLevel } from "@/features/settings/settings.util";
import type { PoolDex } from "@/features/liquidity/liquidity.schema";
import { toast } from "sonner";

type ZapInParams = {
  pool: string;
  amount?: number;
  dex: PoolDex;
};

export const useZapIn = () => {
  const userApi = useUserApi();
  const transactionSettings = useSettingsStore((store) => store.transaction);

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

  return useMutation({
    mutationFn: (params: ZapInParams) => {
      const { zapIn } = useSettingsStore.getState();
      const dexSettings = zapIn.settings[params.dex];
      const rawAmount = params.amount ? params.amount : dexSettings.amount;
      const [minDeltaId, maxDeltaId] = dexSettings.rangeFromCurrentPrice;
      const slippage = {
        liquidity: dexSettings.liquiditySlippage,
        swap: dexSettings.swapSlippage
          ? dexSettings.swapSlippage
          : ("dynamic" as const),
      };

      const inputMint = dexSettings.inputToken.mint;
      const inputDecimals = dexSettings.inputToken.decimals;

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
            strategy: Strategy[zapIn.curveType],
          });
        }
        case "orca-whirlpool": {
          const [lowerPriceChange, upperPriceChange] =
            dexSettings.priceChangesFromCurrentPrice;
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
            priceChanges: dexSettings.priceChangesFromCurrentPrice,
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
            priceChanges: dexSettings.priceChangesFromCurrentPrice,
          });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Zap in successful");
    },
  });
};
