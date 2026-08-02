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

export type LiquidityBar = {
  bin_id: number;
  price: number;
  value: number;
  height: number;
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

/**
 * Downsample the pool's bin liquidity into `count` normalized bars.
 * Each bar's value is the USD depth of the bin; heights are 0..1.
 */
export function getLiquidityBars(
  pool: LiquidityPool,
  count = 60,
): LiquidityBar[] {
  const bins = pool.liquidity_distribution;
  if (!bins?.length) return [];

  const { base, quote } = getPoolTokens(pool);
  const basePrice = base.priceUsd ?? 0;
  const quotePrice = quote.priceUsd ?? 0;
  const values = bins.map(
    (bin) => bin.base_amount * basePrice + bin.quote_amount * quotePrice,
  );
  const max = Math.max(...values, 1);

  const step = Math.max(1, Math.ceil(bins.length / count));
  const bars: LiquidityBar[] = [];
  for (let i = 0; i < bins.length; i += step) {
    const group = bins.slice(i, i + step);
    const mid = group[Math.floor(group.length / 2)]!;
    const value =
      group.reduce((sum, _bin, j) => sum + values[i + j]!, 0) / group.length;
    bars.push({
      bin_id: mid.bin_id,
      price: mid.price,
      value,
      height: value / max,
    });
  }
  return bars;
}

/** Index of the bar closest to the pool's active bin. */
export function getActiveBinIndex(
  bars: LiquidityBar[],
  activeId?: number,
): number {
  if (!bars.length) return 0;
  if (activeId === undefined) return Math.floor(bars.length / 2);

  let best = 0;
  let bestDiff = Infinity;
  bars.forEach((bar, i) => {
    const diff = Math.abs(bar.bin_id - activeId);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

/** Evenly sample `count` price labels across the bars for axis ticks. */
export function getPriceLabels(bars: LiquidityBar[], count = 7): number[] {
  if (!bars.length) return [];
  const step = bars.length > 1 ? bars.length / (count - 1) : 0;
  return Array.from(
    { length: count },
    (_, i) => bars[Math.min(Math.round(i * step), bars.length - 1)]!.price,
  );
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
