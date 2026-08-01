import { api } from "@/lib/api";
import type { LiquidityPoolFilters } from "./liquidity.schema";
import type { RawLiquidityPool } from "./liquidity.type";
import { getTokens } from "../market/market.api";
import { mapLiquidityPool } from "./liquidity.util";

export const getLiquidityPools = async (params: LiquidityPoolFilters) => {
  const response = await api.get<RawLiquidityPool[]>("/pools", {
    params: { ...params, limit: 3 },
  });

  const mints = Array.from(
    new Set(
      response.data.flatMap((pool) => [pool.token_mint_a, pool.token_mint_b]),
    ),
  ).filter((mint): mint is string => !!mint);

  const [settledTokens] = await Promise.allSettled([getTokens(mints)]);
  const tokens =
    settledTokens.status === "fulfilled" ? settledTokens.value : [];

  const resolvedPools = response.data.map((pool) => {
    return mapLiquidityPool({
      ...pool,
      token_a: tokens.find((t) => t.mint === pool.token_mint_a),
      token_b: tokens.find((t) => t.mint === pool.token_mint_b),
    });
  });

  return { pools: resolvedPools };
};

export const getLiquidityPool = async (address: string) => {
  const response = await api.get<RawLiquidityPool>(`/pools/${address}`);

  return mapLiquidityPool(response.data);
};
