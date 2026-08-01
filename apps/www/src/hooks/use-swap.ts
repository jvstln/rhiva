import { useMemo } from "react";
import { NATIVE_MINT } from "@solana/spl-token";
import type UserAPI from "@rhivadotfun/userapi";
import { useMutation } from "@tanstack/react-query";

import { toBps } from "@/lib/math.util";
import { useUserApi } from "./use-user-api";
import { useSettingsStore } from "@/features/settings/settings.store";

type BaseSwapParams = {
  amount: number;
  slippage?: number;
  quoteResponse?: Awaited<
    ReturnType<UserAPI["transaction"]["swap"]["getQuote"]>
  >;
};

type SwapParams =
  | (BaseSwapParams & {
      action: "buy";
      inputMint?: string;
      inputDecimals?: number;
      outputMint: string;
    })
  | (BaseSwapParams & {
      action: "sell";
      inputMint: string;
      inputDecimals: number;
      outputMint?: string;
    });

export const useSwap = () => {
  const userApi = useUserApi();
  const tradingSettings = useSettingsStore((store) => store.trading);

  const activePreset = useMemo(
    () => tradingSettings.presets[tradingSettings.activePreset]!,
    [tradingSettings.presets, tradingSettings.activePreset],
  );

  return useMutation({
    mutationFn: async (params: SwapParams) => {
      const preset =
        params.action === "buy" ? activePreset.buy : activePreset.sell;
      const slippageBps = params.slippage
        ? toBps(params.slippage)
        : preset.slippage
          ? toBps(preset.slippage)
          : "dynamic";
      const inputMint = params.inputMint
        ? params.inputMint
        : NATIVE_MINT.toBase58();
      const outputMint = params.outputMint
        ? params.outputMint
        : NATIVE_MINT.toBase58();

      const inputDecimals = params.inputDecimals ? params.inputDecimals : 9;
      const amount = params.amount * Math.pow(10, inputDecimals);

      const feeConfig =
        "maxFee" in preset
          ? { maxFee: preset.maxFee }
          : "priorityFee" in preset
            ? { priorityFee: preset.priorityFee }
            : {};

      const quoteResponse = params.quoteResponse
        ? params.quoteResponse
        : await userApi.transaction.swap.getQuote({
            amount,
            inputMint,
            outputMint,
            slippageBps,
            action: params.action,
          });

      return userApi.transaction.swap.swap({
        feeConfig,
        ...quoteResponse,
      });
    },
  });
};
