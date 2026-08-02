import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { PoolFeeDetails } from "./PoolFeeDetails";
import { PoolIdentityCard } from "./PoolIdentityCard";
import { PoolVolumeAndTvl } from "./PoolVolumeAndTvl";

export function PoolDetailSidebar({ pool }: { pool: LiquidityPool }) {
  return (
    <div className="border-r">
      <PoolIdentityCard pool={pool} />
      <PoolFeeDetails pool={pool} />
      <PoolVolumeAndTvl pool={pool} />
    </div>
  );
}
