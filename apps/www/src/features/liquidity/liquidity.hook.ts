"use client";

import { useQuery } from "@tanstack/react-query";
import { useWalletTokens } from "@/hooks";
import { getLiquidityPools, getLiquidityPool } from "./liquidity.api";
import { LiquidityPoolFilters } from "./liquidity.schema";
import type { LiquidityPool } from "./liquidity.type";

export function useLiquidityPools(filters: LiquidityPoolFilters = {}) {
  const { data: dependentFilters } = LiquidityPoolFilters.safeParse(filters);

  return useQuery({
    queryKey: ["liquidity", "pools", dependentFilters],
    queryFn: () => getLiquidityPools(filters),
  });
}

export function useLiquidityPool(id: string) {
  return useQuery({
    queryKey: ["liquidity", "pool", id],
    queryFn: () => getLiquidityPool(id),
    enabled: !!id,
  });
}

export function usePoolTokenBalances(pool: LiquidityPool | undefined) {
  return useWalletTokens({ enabled: Boolean(pool) });
}
