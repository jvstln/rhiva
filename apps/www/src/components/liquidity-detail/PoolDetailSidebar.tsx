import { PoolFeeDetails } from "./PoolFeeDetails";
import { PoolIdentityCard } from "./PoolIdentityCard";
import { PoolVolumeAndTvl } from "./PoolVolumeAndTvl";

export function PoolDetailSidebar() {
  return (
    <div className="border-r">
      <PoolIdentityCard />
      <PoolFeeDetails />
      <PoolVolumeAndTvl />
    </div>
  );
}
