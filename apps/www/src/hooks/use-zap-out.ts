import type z from "zod";
import { useCallback, useMemo } from "react";
import type { jitoConfigSchema } from "@rhivadotfun/api";

import { useUserApi } from "./use-user-api";
import { useSettingsStore } from "@/features/settings/settings.store";
import { toJitoPriorityLevel } from "@/features/settings/settings.util";
import type { PoolDex } from "@/features/liquidity/liquidity.schema";

type ZapInParams = {
  position: string;
  dex: PoolDex;
};

export const useZapOut = (params: ZapInParams) => {
  const userApi = useUserApi();
  const [zapOutSettings, transactionSettings] = useSettingsStore((store) => [
    store.zapOut,
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
    const slippage = {
      liquidity: zapOutSettings.liquiditySlippage,
      swap: zapOutSettings.swapSlippage
        ? zapOutSettings.swapSlippage
        : ("dynamic" as const),
    };

    const outputMint = zapOutSettings.outputToken.mint;
    const outputTokenProgram = zapOutSettings.outputToken.tokenProgram;

    switch (params.dex) {
      case "meteora-dlmm": {
        return userApi.transaction.dex.meteora.dlmm.buildTransaction({
          slippage,
          outputMint,
          jitoConfig,
          outputTokenProgram,
          action: "close-position",
          position: params.position,
        });
      }
      case "orca-whirlpool": {
        return userApi.transaction.dex.orca.whirlpool.buildTransaction({
          slippage,
          outputMint,
          jitoConfig,
          outputTokenProgram,
          action: "close-position",
          position: params.position,
        });
      }
      case "raydium-clmm":
        return userApi.transaction.dex.raydium.clmm.buildTransaction({
          slippage,
          outputMint,
          jitoConfig,
          outputTokenProgram,
          action: "close-position",
          position: params.position,
        });
    }
  }, [params, userApi, zapOutSettings, jitoConfig]);
};
