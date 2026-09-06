import type { WsLiquidityEvent } from "@rhivadotfun/dataapi";

import type { State } from "./utils";

export const onLiquidity = <T extends State>(
  state: T,
  event: WsLiquidityEvent,
) => {
  if (state.tokens) {
    let modified = false;
    const tokens = state.tokens.map((token) => {
      const isAdd = event.kind === "add";
      const isBase = token.mint === event.base_mint;
      const isQuote = token.mint === event.quote_mint;

      if (isBase || isQuote) {
        modified = true;
        const amountUsd = isBase ? event.base_usd : event.quote_usd;
        const currentLiquidity = token.liquidity_usd ? token.liquidity_usd : 0;
        const newLiquidity = isAdd
          ? currentLiquidity + amountUsd
          : Math.max(0, currentLiquidity - amountUsd);

        const updatedPools = token.pools.map((pool) => {
          if (pool.pool === event.pool) {
            return {
              ...pool,
              liquidity_usd: newLiquidity,
              base_reserve: event.base_reserve,
              quote_reserve: event.quote_reserve,
            };
          }
          return pool;
        });

        return {
          ...token,
          liquidity_usd: newLiquidity,
          pools: updatedPools ? updatedPools : token.pools,
        };
      }

      return token;
    });

    return modified ? { tokens } : state;
  }

  return state;
};
