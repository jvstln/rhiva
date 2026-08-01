import { cn } from "@/lib/utils";
import { POOL_DETAIL } from "@/components/ui/data/liquidity-detail-data";

export function PoolFeeDetails() {
  return (
    <div className="space-y-4 border-border/70 border-b p-4">
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
          <div
            key={row.label}
            className="flex items-center justify-between py-0.5 text-b-4"
          >
            <span className="text-gray">{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between py-0.5 text-b-4">
          <span className="text-gray">{"Fee Collection Token"}</span>
          <span>{POOL_DETAIL.feeCollectionToken}</span>
        </div>
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
      <p className="text-b-4 text-gray">{label}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="font-bold text-b-1 text-white">{value}</span>
        <span
          className={cn(
            "font-medium text-b-4",
            isDown ? "text-down" : "text-up",
          )}
        >
          ({change})
        </span>
      </p>
    </div>
  );
}
