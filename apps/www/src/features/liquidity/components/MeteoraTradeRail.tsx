import type { LiquidityPool } from "../liquidity.type";
import { PoolTradeForm } from "./detail/PoolTradeForm";
import { PriceRangeSelector } from "./detail/PriceRangeSelector";

export function MeteoraTradeRail({ pool }: { pool: LiquidityPool }) {
  return (
    <aside>
      <PoolTradeForm pool={pool} />
      <PriceRangeSelector pool={pool} />
    </aside>
  );
}
