import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";
import { cn } from "@/lib/utils";

export function PoolFeeDetails({ pool }: { pool: LiquidityPool }) {
  const totalFeePct = pool.totalFeePct ?? 0;
  const volume24h = pool.volume ?? 0;
  const activeTvl = pool.activeTvl ?? 0;

  const fees24hValue =
    pool.feesUsd ?? pool.fees ?? volume24h * (totalFeePct / 100);
  const fees24hTvlPct = activeTvl > 0 ? (fees24hValue / activeTvl) * 100 : 0;

  const feesChange = formatSignedPercent(pool.feesChange);
  const feesRatioChange = formatSignedPercent(pool.feesRatioChange);

  const feeSchedule = [
    { label: "Bin Step", value: String(pool.binStep ?? "—") },
    { label: "Base Fee", value: pool.baseFeePct ? `${pool.baseFeePct}%` : "—" },
    {
      label: "Dynamic Fee",
      value: pool.dynamicFeePct ? `${pool.dynamicFeePct}%` : "—",
    },
    {
      label: "Total Trading Fee",
      value: pool.totalFeePct ? `${pool.totalFeePct}%` : "—",
    },
    {
      label: "Max Fee",
      value: pool.maxFeePct ? `${pool.maxFeePct}%` : "—",
    },
    {
      label: "Protocol Fee",
      value: pool.protocolFeePct ? `${pool.protocolFeePct}%` : "—",
    },
  ];

  return (
    <div className="space-y-4 border-border/70 border-b p-4">
      <div className="grid grid-cols-2 gap-4">
        <FeeStat
          label="24h Fees"
          value={formatCompactCurrency(fees24hValue)}
          change={feesChange}
        />
        <FeeStat
          label="24h Fees/TVL"
          value={`${fees24hTvlPct.toFixed(2)}%`}
          change={feesRatioChange}
        />
      </div>

      <div className="space-y-1">
        {feeSchedule.map((row) => (
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
          <span>{pool.feeCollectionToken ?? "Base + Quote"}</span>
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
