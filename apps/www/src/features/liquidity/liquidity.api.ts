import { api } from "@/lib/api";
import type { LiquidityPoolFilters } from "./liquidity.schema";
import type { RawLiquidityPool } from "./liquidity.type";
import { getToken } from "../market/market.api";
import { mapLiquidityPool } from "./liquidity.util";

export const getLiquidityPools = async (params: LiquidityPoolFilters) => {
  const response = await api.get<RawLiquidityPool[]>("/pools", { params });

  const pools = await Promise.all(
    response.data.map(async (pool) => {
      const [token_a, token_b] = await Promise.allSettled([
        getToken(pool.token_mint_a),
        getToken(pool.token_mint_b),
      ]);

      return {
        ...mapLiquidityPool(pool),
        token_a: token_a.status === "fulfilled" ? token_a.value : null,
        token_b: token_b.status === "fulfilled" ? token_b.value : null,
      };
    }),
  );

  return { pools };
};
