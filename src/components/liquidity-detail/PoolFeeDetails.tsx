import { InfoRow } from "@/components/token-detail/InfoSection";
import { POOL_DETAIL } from "@/data/liquidity-detail-data";
import { cn } from "@/lib/utils";

export function PoolFeeDetails() {
  return (
    <div className="space-y-4 border-b border-border/70 p-4">
      <div className="grid grid-cols-2 gap-4">
        <FeeStat
          label="24h Fees"
          value={POOL_DETAIL.fees24h}
          change={POOL_DETAIL.fees24hChange}
        />
        <FeeStat
          label="24h Fees/TVL"
          value={POOL_DETAIL.fees24hTvl}
          change={POOL_DETAIL.fees24hTvlChange}
        />
      </div>

      <div className="space-y-1">
        {POOL_DETAIL.feeSchedule.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
        <InfoRow
          label="Fee Collection Token"
          value={POOL_DETAIL.feeCollectionToken}
        />
      </div>
    </div>
  );
}

function FeeStat({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  const isDown = change.startsWith("-");
  return (
    <div>
      <p className="text-b-4 text-grey">{label}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-b-1 font-bold text-white">{value}</span>
        <span
          className={cn(
            "text-b-4 font-medium",
            isDown ? "text-down" : "text-up",
          )}
        >
          ({change})
        </span>
      </p>
    </div>
  );
}
