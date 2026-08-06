import type z from "zod";
import { toast } from "sonner";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import type { jitoConfigSchema } from "@rhivadotfun/api";

import { useUserApi } from "../../../hooks/use-user-api";
import type { PoolDex } from "@/features/liquidity/liquidity.schema";
import { useSettingsStore } from "@/features/settings/settings.store";
import { toJitoPriorityLevel } from "@/features/settings/settings.util";

type ZapOutParams = {
  position: string;
  dex: PoolDex;
};

export const useZapOut = () => {
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

  return useMutation({
    mutationFn: async (params: ZapOutParams) => {
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Zap in successful");
    },
  });
};
