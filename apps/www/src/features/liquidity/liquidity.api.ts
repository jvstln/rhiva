import type { PoolsQuery } from "@rhivadotfun/dataapi";

import { dataapi } from "@/lib/dataapi";
import { getTokens } from "../market/market.api";
import type { PoolWithTokens } from "./liquidity.type";
import type { LiquidityPoolFilters } from "./liquidity.schema";

export const getLiquidityPools = async (
  params: LiquidityPoolFilters,
): Promise<PoolWithTokens[]> => {
  const queryParams: PoolsQuery = {
    dex: params.dex ?? null,
    query: null,
    min_bin_step: null,
    max_bin_step: null,
    min_tick_spacing: null,
    max_tick_spacing: null,
    min_volume_1h: null,
    sort: params.sort ?? null,
    order: null,
    limit: null,
    offset: null,
  };

  const response = await dataapi.pools.getPools(queryParams);
  const mints = Array.from(
    new Set(response.flatMap((data) => [data.token_mint_a, data.token_mint_b])),
  );
  const tokens = new Map(
    (await getTokens(mints)).map((token) => [token.mint, token] as const),
  );

  return response.map((pool) => {
    const token_a = tokens.get(pool.token_mint_a);
    const token_b = tokens.get(pool.token_mint_b);
    return {
      ...pool,
      token_a,
      token_b,
    };
  });
};

export const getLiquidityPool = async (address: string) => {
  const pool = await dataapi.pools.getPoolDetail(address);
  if (!pool) throw new Error("Pool not found");

  const tokens = await getTokens([pool.token_mint_a, pool.token_mint_b]);

  return {
    ...pool,
    token_a: tokens.find((token) => token.mint === pool.token_mint_a),
    token_b: tokens.find((token) => token.mint === pool.token_mint_b),
  };
};
