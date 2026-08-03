import { Separator } from "@/components/ui/separator";
import { SideRailRow, SideRailSection } from "@/components/ui/side-rail";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedPercent,
  formatSignedUsd,
} from "@/lib/finance.util";
import { formatAge } from "@/lib/date.util";
import { cn } from "@/lib/utils";

const formatPercent = (value?: number | null, digits = 2) =>
  value == null ? "-" : `${Number(value.toFixed(digits))}%`;

export function PoolDataSections({ pool }: { pool: LiquidityPool }) {
  const totalFeePct = Number(pool.total_fee_pct ?? 0);
  const volume24h = pool.volume_24h_usd ?? 0;
  const activeTvl = pool.active_tvl_usd ?? 0;

  // TODO: 24h fees uses fees_usd if available; falls back to volume_24h_usd * total_fee_pct.
  const fees24hValue = pool.fees_usd ?? volume24h * (totalFeePct / 100);
  const fees24hTvlPct = activeTvl > 0 ? (fees24hValue / activeTvl) * 100 : 0;

  const withChange = (value: string, change?: number | null) => (
    <span className="flex items-baseline gap-2">
      {value}
      {change != null && (
        <span className={change < 0 ? "text-down" : "text-up"}>
          ({formatSignedPercent(change)})
        </span>
      )}
    </span>
  );

  return (
    <div className="">
      <SideRailSection title={"Fees"}>
        <SideRailRow
          label="24h Fees"
          value={
            <span className="flex items-baseline gap-2">
              {formatCompactCurrency(fees24hValue)}
              {pool.fees_change_pct && (
                <span
                  className={cn(
                    pool.fees_change_pct < 0 ? "text-down" : "text-up",
                  )}
                >
                  ({formatSignedPercent(pool.fees_change_pct)})
                </span>
              )}
            </span>
          }
        />
        <SideRailRow
          label="24h Fees/TVL"
          value={
            <span className="flex items-baseline gap-2">
              {formatSignedPercent(fees24hTvlPct)}
              {pool.fees_ratio_change_pct && (
                <span
                  className={cn(
                    pool.fees_ratio_change_pct < 0 ? "text-down" : "text-up",
                  )}
                >
                  ({formatSignedPercent(pool.fees_ratio_change_pct)})
                </span>
              )}
            </span>
          }
        />
      </SideRailSection>

      <Separator />

      <SideRailSection title="Basic Data">
        {[
          {
            label: "Bin Step",
            value: formatCompactNumber(pool.bin_step),
          },
          {
            label: "Base Fee",
            value: formatSignedPercent(pool.base_fee_pct),
          },
          {
            label: "Dynamic Fee",
            value: formatSignedPercent(pool.dynamic_fee_pct),
          },
          {
            label: "Total Trading Fee",
            value: formatSignedPercent(pool.total_fee_pct),
          },
          // TODO: max_fee_pct is specific to certain DLMM pools; "—" when not present.
          {
            label: "Max Fee",
            value: formatSignedPercent(pool.max_fee_pct),
          },
          {
            label: "Protocol Fee",
            value: formatSignedPercent(pool.protocol_fee_pct),
          },
          {
            label: "Fee Collection Token",
            // TODO: fee_collection_token defaults to "Base + Quote" when not specified.
            value: pool.fee_collection_token ?? "Base + Quote",
          },
        ].map((item) => (
          <SideRailRow
            key={item.label}
            {...item}
          />
        ))}
      </SideRailSection>
      <Separator />

      <SideRailSection title="Advanced Metrics">
        {[
          {
            label: "Pool Age",
            value: formatAge(pool.age_seconds),
          },
          {
            label: "Volatility",
            value: formatPercent(pool.volatility_pct),
          },
          {
            label: "Active TVL",
            value: withChange(
              formatCompactCurrency(pool.active_tvl_usd),
              pool.active_tvl_change_pct,
            ),
          },
          {
            label: "Fees/Active TVL",
            value: withChange(
              formatPercent(pool.fees_ratio),
              pool.fees_ratio_change_pct,
            ),
          },
          {
            label: "Volume/Active TVL",
            value: withChange(
              formatPercent(pool.volume_ratio),
              pool.volume_ratio_change_pct,
            ),
          },
          {
            label: "Total LPs",
            value: withChange(
              formatCompactNumber(pool.total_lps),
              pool.total_lps_change_pct,
            ),
          },
          {
            label: "New LPs",
            value: formatCompactNumber(pool.new_lps),
          },
          {
            label: "Positions Created",
            value: formatCompactNumber(
              pool.positions_created == null
                ? null
                : Number(pool.positions_created),
            ),
          },
          {
            label: "Open Positions",
            value: formatCompactNumber(Number(pool.open_positions)),
          },
          {
            label: "In Range Positions",
            value: formatCompactNumber(pool.in_range_positions),
          },
          {
            label: "Avg Fees/Min",
            value: formatCompactCurrency(pool.avg_fees_per_min_usd),
          },
          {
            label: "Avg Vol/Min",
            value: formatCompactCurrency(pool.avg_volume_usd),
          },
          {
            label: "Traders",
            value: formatCompactNumber(Number(pool.traders_24h)),
          },
          {
            label: "Swaps",
            value: formatCompactNumber(pool.swaps_24h),
          },
          {
            label: "Net Deposits",
            value: withChange(
              formatSignedUsd(pool.net_deposit_usd),
              pool.net_deposit_split?.net_pct,
            ),
          },
        ].map((item) => (
          <SideRailRow
            key={item.label}
            {...item}
          />
        ))}
      </SideRailSection>
    </div>
  );
}
