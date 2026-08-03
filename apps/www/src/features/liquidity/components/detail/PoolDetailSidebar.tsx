import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { Separator } from "@/components/ui/separator";
import { PoolDataSections } from "./PoolDetailDataSections";
import { PoolIdentityCard } from "./PoolIdentityCard";
import { PoolVolumeAndTvl } from "./PoolVolumeAndTvl";
import { PoolDetailTokenInfo } from "./PoolDetailTokenInfo";
import { PoolExternalLinks } from "./PoolExternalLinks";

export function PoolDetailSidebar({ pool }: { pool: LiquidityPool }) {
  return (
    <div className="border-r">
      <PoolIdentityCard pool={pool} />
      <PoolDataSections pool={pool} />
      <PoolVolumeAndTvl pool={pool} />
      <Separator />
      <PoolDetailTokenInfo pool={pool} />
      <Separator />
      <PoolExternalLinks pool={pool} />
    </div>
  );
}
