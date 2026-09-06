import type { TokenFull } from "@rhivadotfun/dataapi";
import { useBlacklistStore } from "@/features/market/blacklist.store";

export type State = { tokens: TokenFull[] | null };

export type AddToTop<T extends State = State> = {
  set(state: (state: T) => T): void;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonZeroNonNull = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return value !== 0 && !Number.isNaN(value);
  if (typeof value === "string") return value.length > 0;
  return true;
};

export const deepMergeNonNullNonZero = <T>(target: T, source: unknown): T => {
  if (source == null) return target;
  if (!isObject(source))
    return isNonZeroNonNull(source) ? (source as T) : target;

  const result: Record<string, unknown> = isObject(target) ? { ...target } : {};

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = result[key];

    if (sourceValue === null || sourceValue === undefined) continue;

    if (Array.isArray(sourceValue)) {
      if (sourceValue.length === 0) continue;
      if (
        Array.isArray(targetValue) &&
        targetValue.length > 0 &&
        key === "pools"
      ) {
        const merged = [...targetValue];
        for (const sourcePool of sourceValue) {
          if (isObject(sourcePool) && typeof sourcePool.pool === "string") {
            const idx = merged.findIndex(
              (pool) => isObject(pool) && pool.pool === sourcePool.pool,
            );
            if (idx > -1) {
              merged[idx] = deepMergeNonNullNonZero(merged[idx], sourcePool);
            } else {
              merged.push(sourcePool);
            }
          } else {
            merged.push(sourcePool);
          }
        }
        result[key] = merged;
        continue;
      }
      result[key] = sourceValue;
    } else if (isObject(sourceValue)) {
      result[key] = deepMergeNonNullNonZero(targetValue, sourceValue);
    } else if (isNonZeroNonNull(sourceValue)) {
      if (
        typeof targetValue === "boolean" &&
        targetValue === true &&
        sourceValue === false
      ) {
        continue;
      }
      result[key] = sourceValue;
    }
  }

  return result as T;
};

export const insertOrMoveByRank = <T>(
  list: T[],
  item: T,
  rank: number | undefined,
  matchFn: (a: T) => boolean,
): T[] => {
  const nextList = [...list];
  const existingIndex = nextList.findIndex(matchFn);
  if (existingIndex > -1) {
    nextList.splice(existingIndex, 1);
  }

  if (typeof rank === "number" && !Number.isNaN(rank) && rank > 0) {
    const targetIndex = Math.max(0, Math.min(rank - 1, nextList.length));
    nextList.splice(targetIndex, 0, item);
  } else {
    nextList.unshift(item);
  }

  return nextList;
};

export const mergeFreshTokens = (
  existingTokens: TokenFull[] | null,
  incomingTokens: TokenFull[],
): TokenFull[] => {
  const blacklistFilter = (t: TokenFull) => {
    try {
      return !useBlacklistStore.getState().isTokenBlacklisted(t);
    } catch {
      return true;
    }
  };

  const validIncoming = incomingTokens.filter(blacklistFilter);
  const validExisting = existingTokens
    ? existingTokens.filter(blacklistFilter)
    : null;

  if (!validExisting || validExisting.length === 0) {
    return validIncoming;
  }
  if (!validIncoming || validIncoming.length === 0) {
    return validExisting;
  }
  const incomingMap = new Map(validIncoming.map((t) => [t.mint, t]));
  const existingMints = new Set(validExisting.map((t) => t.mint));

  const mergedExisting: TokenFull[] = validExisting.map((existing) => {
    const incoming = incomingMap.get(existing.mint);
    if (!incoming) return existing;

    return {
      ...incoming,
      ...existing,
      name: existing.name || incoming.name,
      symbol: existing.symbol || incoming.symbol,
      image_uri: existing.image || incoming.image,
      price_usd: existing.price_usd || incoming.price_usd,
      price_native: existing.price_native || incoming.price_native,
      market_cap_usd: existing.market_cap_usd || incoming.market_cap_usd,
      fdv_usd: existing.fdv_usd || incoming.fdv_usd,
      liquidity_usd:
        existing.liquidity_usd !== undefined
          ? existing.liquidity_usd
          : incoming.liquidity_usd,
      stats: deepMergeNonNullNonZero(incoming.stats, existing.stats),
      screener: deepMergeNonNullNonZero(incoming.screener, existing.screener),
      pools: incoming.pools?.length ? incoming.pools : existing.pools,
      surge: deepMergeNonNullNonZero(incoming.surge, existing.surge),
    };
  });

  const newIncoming = validIncoming.filter((t) => !existingMints.has(t.mint));

  return [...mergedExisting, ...newIncoming];
};
