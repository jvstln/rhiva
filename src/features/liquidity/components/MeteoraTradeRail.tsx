import { PoolTradeForm } from "../../../components/liquidity-detail/PoolTradeForm";
import { PriceRangeSelector } from "../../../components/liquidity-detail/PriceRangeSelector";

export function MeteoraTradeRail() {
  return (
    <aside>
      <PoolTradeForm />
      <PriceRangeSelector />
    </aside>
  );
}
