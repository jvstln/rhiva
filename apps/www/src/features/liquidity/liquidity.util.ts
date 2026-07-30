import type { PoolRow } from "@/components/ui/data/liquidity-data";
import type { RawLiquidityPool } from "./liquidity.type";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";

const formatPercent = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "N/A";
  }
  return `${Number(value).toFixed(2)}%`;
};

const shortId = (value?: string) => (value ? value.slice(0, 6) : "----");

export const mapLiquidityPool = (
  pool: RawLiquidityPool,
): RawLiquidityPool & PoolRow => {
  const tvlNum = Number(pool.liquidity) || 0;
  const activeTvlNum = Number(pool.active_tvl_usd ?? 0);
  const volume24h = pool.volume_24h_usd ?? 0;
  const totalFeePct = Number(
    pool.total_fee_pct ?? pool.base_fee_pct ?? pool.dynamic_fee_pct ?? 0,
  );
  const feesValue = volume24h * (totalFeePct / 100);

  const feeLabel =
    totalFeePct > 0
      ? formatPercent(totalFeePct)
      : pool.bin_step !== undefined
        ? `${pool.bin_step}%`
        : "N/A";

  const feesRatio =
    activeTvlNum > 0 ? formatPercent((feesValue / activeTvlNum) * 100) : "N/A";
  const volumeRatio =
    activeTvlNum > 0 ? formatPercent((volume24h / activeTvlNum) * 100) : "N/A";

  return {
    ...pool,
    pair: `${shortId(pool.token_mint_a)}/${shortId(pool.token_mint_b)}`,
    tickSpacing: pool.tick_spacing ?? 0,
    fee: feeLabel,
    age: String(pool.last_update_ms),
    marketCap:
      pool.market_cap_usd !== undefined && pool.market_cap_usd !== null
        ? formatCompactCurrency(pool.market_cap_usd)
        : "N/A",
    marketCapChange:
      pool.market_cap_change_pct !== undefined &&
      pool.market_cap_change_pct !== null
        ? formatSignedPercent(pool.market_cap_change_pct)
        : "N/A",
    tvl: tvlNum > 0 ? formatCompactCurrency(tvlNum) : "N/A",
    tvlChange:
      pool.tvl_change_pct !== undefined && pool.tvl_change_pct !== null
        ? formatSignedPercent(pool.tvl_change_pct)
        : "N/A",
    activeTvl: activeTvlNum > 0 ? formatCompactCurrency(activeTvlNum) : "N/A",
    activeTvlChange:
      pool.active_tvl_change_pct !== undefined &&
      pool.active_tvl_change_pct !== null
        ? formatSignedPercent(pool.active_tvl_change_pct)
        : "N/A",
    fees: feesValue > 0 ? formatCompactCurrency(feesValue) : "N/A",
    feesChange:
      pool.fees_ratio_change_pct !== undefined &&
      pool.fees_ratio_change_pct !== null
        ? formatSignedPercent(pool.fees_ratio_change_pct)
        : "N/A",
    feesRatio,
    feesRatioChange:
      pool.fees_ratio_change_pct !== undefined &&
      pool.fees_ratio_change_pct !== null
        ? formatSignedPercent(pool.fees_ratio_change_pct)
        : "N/A",
    volume: volume24h > 0 ? formatCompactCurrency(volume24h) : "N/A",
    volumeChange:
      pool.volume_change_pct !== undefined && pool.volume_change_pct !== null
        ? formatSignedPercent(pool.volume_change_pct)
        : "N/A",
    volumeRatio,
    volumeRatioChange:
      pool.volume_ratio_change_pct !== undefined &&
      pool.volume_ratio_change_pct !== null
        ? formatSignedPercent(pool.volume_ratio_change_pct)
        : "N/A",
  };
};
