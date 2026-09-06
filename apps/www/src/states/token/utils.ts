import type { TokenFull } from "@rhivadotfun/dataapi";

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

export const lazyFetchToken = <T extends State>(
  _mint: string,
  _addToTop: AddToTop<T>,
) => {
  return;
  // dataapi.token
  //   .getToken({ address: mint })
  //   .then((value) => {
  //     addToTop.set((state) => {
  //       if (!state.tokens) return state;
  //       const index = state.tokens.findIndex((token) => token.mint === mint);
  //       if (index === -1) return state;

  //       const tokens = [...state.tokens];
  //       tokens[index] = deepMergeNonNullNonZero(tokens[index], value);
  //       return { ...state, tokens };
  //     });
  //   })
  //   .catch((error) => {
  //     console.error(error, "lazy fetching token failed for", mint);
  //   });
};
