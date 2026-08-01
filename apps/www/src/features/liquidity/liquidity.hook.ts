"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getLiquidityPools } from "./liquidity.api";
import type { LiquidityPoolFilters } from "./liquidity.schema";

export function useLiquidityPools(params: LiquidityPoolFilters = {}) {
  return useQuery({
    queryKey: ["liquidity", "pools", params],
    queryFn: () => getLiquidityPools(params),
  });
}

export function useLiquidityPool(id: string) {
  const pools = useLiquidityPools();

  return {
    ...pools,
    data: pools.data?.find((pool) => pool.pool_address === id),
  } as unknown as UseQueryResult<NonNullable<typeof pools.data>[number]>;
}
