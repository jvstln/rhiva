import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";
import { cn } from "@/lib/utils";

export function PoolFeeDetails({ pool }: { pool: LiquidityPool }) {
  const totalFeePct = Number(pool.total_fee_pct ?? 0);
  const volume24h = pool.volume_24h_usd ?? 0;
  const activeTvl = pool.active_tvl_usd ?? 0;

  // TODO: 24h fees uses fees_usd if available; falls back to volume_24h_usd * total_fee_pct.
  const fees24hValue = pool.fees_usd ?? volume24h * (totalFeePct / 100);
  const fees24hTvlPct = activeTvl > 0 ? (fees24hValue / activeTvl) * 100 : 0;

  const feesChange = formatSignedPercent(pool.fees_change_pct);
  const feesRatioChange = formatSignedPercent(pool.fees_ratio_change_pct);

  const feeSchedule = [
    { label: "Bin Step", value: pool.bin_step ? String(pool.bin_step) : "—" },
    {
      label: "Base Fee",
      value: pool.base_fee_pct ? `${pool.base_fee_pct}%` : "—",
    },
    {
      label: "Dynamic Fee",
      value: pool.dynamic_fee_pct ? `${pool.dynamic_fee_pct}%` : "—",
    },
    {
      label: "Total Trading Fee",
      value: pool.total_fee_pct ? `${pool.total_fee_pct}%` : "—",
    },
    {
      // TODO: max_fee_pct is specific to certain DLMM pools; "—" when not present.
      label: "Max Fee",
      value: pool.max_fee_pct ? `${pool.max_fee_pct}%` : "—",
    },
    {
      label: "Protocol Fee",
      value: pool.protocol_fee_pct ? `${pool.protocol_fee_pct}%` : "—",
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
        {/* TODO: fee_collection_token defaults to "Base + Quote" when not specified. */}
        <div className="flex items-center justify-between py-0.5 text-b-4">
          <span className="text-gray">Fee Collection Token</span>
          <span>{pool.fee_collection_token ?? "Base + Quote"}</span>
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
