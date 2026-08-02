"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getLiquidityPools,
  getLiquidityPool,
  getPoolDetail,
} from "./liquidity.api";
import { LiquidityPoolFilters } from "./liquidity.schema";

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

export function usePoolDetail(id: string) {
  return useQuery({
    queryKey: ["liquidity", "poolDetail", id],
    queryFn: () => getPoolDetail(id),
    enabled: !!id,
  });
}
