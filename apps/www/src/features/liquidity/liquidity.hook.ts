"use client";

import { useQuery } from "@tanstack/react-query";
import { getLiquidityPools, getLiquidityPool } from "./liquidity.api";
import type { LiquidityPoolFilters } from "./liquidity.schema";

export function useLiquidityPools(params: LiquidityPoolFilters = {}) {
  return useQuery({
    queryKey: ["liquidity", "pools", params],
    queryFn: () => getLiquidityPools(params),
  });
}

export function useLiquidityPool(id: string) {
  return useQuery({
    queryKey: ["liquidity", "pool", id],
    queryFn: () => getLiquidityPool(id),
    enabled: !!id,
  });
}
