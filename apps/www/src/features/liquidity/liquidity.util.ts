import type { ParsedTokenAccount } from "@/queries";
import type { LiquidityPool } from "./liquidity.type";

/** sqrt_price is a Q64.64 fixed-point square root of the base/quote price. */
const Q64 = 2 ** 64;

export type PoolToken = {
  symbol: string;
  mint: string | undefined;
  priceUsd: number | null;
  decimals: number | null;
};

const shortMint = (mint?: string) => (mint ? `${mint.slice(0, 6)}...` : "----");

export function getPoolTokens(pool: LiquidityPool): {
  base: PoolToken;
  quote: PoolToken;
} {
  const base = pool.token_a;
  const quote = pool.token_b;

  return {
    base: {
      symbol: base?.symbol || pool.base_symbol || shortMint(base?.mint),
      mint: base?.mint ?? pool.token_a?.mint,
      priceUsd: pool.price_usd || base?.price_usd || null,
      decimals: base?.decimals ?? null,
    },
    quote: {
      symbol: quote?.symbol || "SOL",
      mint: quote?.mint ?? pool.token_b?.mint,
      priceUsd: quote?.price_usd ?? null,
      decimals: quote?.decimals ?? null,
    },
  };
}

/** Price of the base token expressed in the quote token, e.g. "USDC per SOL". */
export function getPoolPriceInQuote(pool: LiquidityPool): number | null {
  if (pool.sqrt_price) {
    const sqrt = Number(pool.sqrt_price) / Q64;
    if (Number.isFinite(sqrt) && sqrt > 0) {
      const price = sqrt * sqrt;
      if (Number.isFinite(price) && price > 0) return price;
    }
  }

  const { base, quote } = getPoolTokens(pool);
  if (base.priceUsd && quote.priceUsd && quote.priceUsd > 0) {
    return base.priceUsd / quote.priceUsd;
  }
  return null;
}

/** USD price of the base token. */
export function getPoolPriceUsd(pool: LiquidityPool): number | null {
  return pool.price_usd || pool.token_a?.price_usd || null;
}

/** Number of bins the pool's distribution spans within [minPrice, maxPrice]. */
export function getBinsInRange(
  pool: LiquidityPool,
  minPrice: number,
  maxPrice: number,
): number {
  if (minPrice <= 0 || maxPrice <= minPrice) return 1;
  const distribution = pool.liquidity_distribution;
  if (distribution?.length) {
    return distribution.filter(
      (bin) => bin.price >= minPrice && bin.price <= maxPrice,
    ).length;
  }
  const binStepRatio = 1 + (pool.bin_step ?? 0) / 10_000;
  return Math.max(
    1,
    Math.round(Math.log(maxPrice / minPrice) / Math.log(binStepRatio)),
  );
}

/** Fractional price change below/above the current price for a given range. */
export function getPriceChangesFromCurrentPrice(
  price: number,
  minPrice: number,
  maxPrice: number,
): [number, number] | null {
  if (price <= 0 || minPrice <= 0 || maxPrice <= minPrice) return null;
  return [(price - minPrice) / price, (maxPrice - price) / price] as [
    number,
    number,
  ];
}

/** Bin delta ids below/above the active bin for a given price range. */
export function getBinDeltasFromRange(
  pool: LiquidityPool,
  price: number,
  minPrice: number,
  maxPrice: number,
): [number, number] | null {
  if (price <= 0 || minPrice <= 0 || maxPrice <= minPrice) return null;
  const binStepRatio = 1 + (pool.bin_step ?? 0) / 10_000;
  if (binStepRatio <= 1) return null;
  return [
    Math.round(Math.log(price / minPrice) / Math.log(binStepRatio)),
    Math.round(Math.log(maxPrice / price) / Math.log(binStepRatio)),
  ] as [number, number];
}

export function formatPrice(value?: number | null, digits = 6): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }
  if (value > 0 && value < 0.001) return value.toExponential(4);
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function formatBalance(value?: number | null, decimals = 4): string {
  if (value === null || value === undefined) return "0";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: Math.min(decimals, 6),
  });
}

export function getTokenBalance(
  balances: ParsedTokenAccount[] | undefined,
  mint?: string,
): number {
  if (!balances || !mint) return 0;
  return (
    balances.find((account) => account.info.mint === mint)?.info.tokenAmount
      .uiAmount ?? 0
  );
}
