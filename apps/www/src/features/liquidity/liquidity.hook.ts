"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks";
import { wallet } from "@/queries";
import {
  getLiquidityPools,
  getLiquidityPool,
  getPoolDetail,
} from "./liquidity.api";
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

export function usePoolDetail(id: string) {
  return useQuery({
    queryKey: ["liquidity", "poolDetail", id],
    queryFn: () => getPoolDetail(id),
    enabled: !!id,
  });
}

export function usePoolTokenBalances(pool: LiquidityPool | undefined) {
  const { connection } = useConnection();
  const auth = useAuth();
  const address = auth.authenticated ? (auth.activeWallet?.address ?? "") : "";

  return useQuery({
    ...wallet.tokens.queryOptions({ connection, address }),
    enabled: Boolean(address) && Boolean(pool),
  });
}
