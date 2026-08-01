import { api } from "@/lib/api";
import { getTokens } from "../market/market.api";
import { mapLiquidityPool } from "./liquidity.util";
import type { RawLiquidityPool } from "./liquidity.type";
import type { LiquidityPoolFilters } from "./liquidity.schema";

export const getLiquidityPools = async (params: LiquidityPoolFilters) => {
  const response = await api.get<RawLiquidityPool[]>("/pools", { params });
  const mints = new Set(
    response.data.flatMap((data) => [data.token_mint_a, data.token_mint_b]),
  );
  const tokens = new Map(
    (await getTokens(Array.from(mints))).map(
      (token) => [token.mint, token] as const,
    ),
  );

  return response.data.map((pool) => {
    const token_a = tokens.get(pool.token_mint_a);
    const token_b = tokens.get(pool.token_mint_b);
    return {
      token_a,
      token_b,
      ...mapLiquidityPool(pool),
    };
  });
};
