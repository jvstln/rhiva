import type { RawLiquidityPool } from "./liquidity.type";
import type { PoolDex } from "./liquidity.schema";
import { mapToken } from "../market/market.util";
const toNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const mapLiquidityPool = (pool: RawLiquidityPool) => {
  const dex: PoolDex = pool.dex?.includes("orca")
    ? "orca"
    : pool.dex?.includes("raydium")
      ? "raydium-clmm"
      : "meteora-dlmm";

  // NOTE: was `toNumber(pool.liquidity)` — that field comes back "" for DLMM
  // pools in the sample payload while `tvl_usd` is populated, so prefer it.
  const tvlNum = toNumber(pool.tvl_usd) ?? toNumber(pool.liquidity) ?? 0;
  const activeTvlNum = toNumber(pool.active_tvl_usd) ?? 0;
  const volume24h = toNumber(pool.volume_24h_usd) ?? 0;
  const totalFeePct = toNumber(
    pool.total_fee_pct ?? pool.base_fee_pct ?? pool.dynamic_fee_pct,
  );
  const feesValue = totalFeePct != null ? volume24h * (totalFeePct / 100) : 0;

  const feesRatio = activeTvlNum > 0 ? (feesValue / activeTvlNum) * 100 : 0;
  const volumeRatio = activeTvlNum > 0 ? (volume24h / activeTvlNum) * 100 : 0;

  return {
    address: String(pool.pool_address),
    dex,
    tokenA: mapToken(pool.token_a?.original ?? { mint: pool.token_mint_a }),
    tokenB: mapToken(pool.token_b?.original ?? { mint: pool.token_mint_b }),
    tickSpacing: pool.tick_spacing ?? 0,
    binStep: pool.bin_step ?? 0,
    age: new Date(pool.last_update_ms ?? Date.now()),

    marketCap: toNumber(pool.market_cap_usd),
    marketCapChange: toNumber(pool.market_cap_change_pct),
    tvl: tvlNum,
    tvlChange: toNumber(pool.tvl_change_pct),
    activeTvl: activeTvlNum,
    activeTvlChange: toNumber(pool.active_tvl_change_pct),
    fees: feesValue,
    feesChange: toNumber(pool.fees_ratio_change_pct),
    feesRatio,
    feesRatioChange: toNumber(pool.fees_ratio_change_pct),
    volume: volume24h,
    volumeChange: toNumber(pool.volume_change_pct),
    volumeRatio,
    volumeRatioChange: toNumber(pool.volume_ratio_change_pct),

    // --- price (LiquidityDetailPage) ---
    baseSymbol: pool.base_symbol ?? null,
    price: toNumber(pool.price_usd),
    priceChange1h: toNumber(pool.price_change_1h_pct),
    priceChange24h: toNumber(pool.price_change_24h_pct),

    // --- pool stats strip ---
    swaps: pool.swaps_24h ?? 0,
    traders: pool.traders_24h ?? 0,
    totalLps: pool.total_lps ?? 0,
    netDeposit: toNumber(pool.net_deposit_usd),
    holders: pool.holders_count ?? 0,
    avgVolume: toNumber(pool.avg_volume_usd) ?? 0,
    minVolatility: toNumber(pool.min_volatility_pct) ?? 0,
    top10Holders: toNumber(pool.top10_holder_pct) ?? 0,
    devBalance: toNumber(pool.dev_balance_pct) ?? 0,

    // --- fee breakdown (detail page sidebar) ---
    totalFeePct: toNumber(pool.total_fee_pct),
    baseFeePct: pool.base_fee_pct ?? null,
    dynamicFeePct: pool.dynamic_fee_pct ?? null,
    protocolFeePct: pool.protocol_fee_pct ?? null,
    maxFeePct: pool.max_fee_pct ?? null,
    feeCollectionToken: pool.fee_collection_token ?? null,
    feesUsd: toNumber(pool.fees_usd),

    // --- tvl distribution (detail page sidebar) ---
    tvlDistribution: pool.tvl_distribution ?? null,

    // --- token stats (detail page sidebar) ---
    tokenStats: pool.token_stats ?? null,
  };
};
