import { join } from "path";
import { format } from "util";
import type { XiorInstance, XiorResponse } from "xior";

export const mapFilter = <T, R>(
  collection: readonly T[],
  mapFn: (item: T, index: number) => R | null | undefined,
): R[] => {
  const results = [];
  for (const [index, item] of collection.entries()) {
    const result = mapFn(item, index);
    if (result != null) results.push(result);
  }

  return results;
};

export abstract class BaseApiImpl {
  protected abstract path?: string;

  protected buildPath(...path: (string | number | undefined)[]) {
    if (this.path)
      return join(
        this.path,
        mapFilter(path, (path) => (path ? String(path) : null)).reduce((a, b) =>
          join(a, b),
        ),
      );

    return mapFilter(path, (path) => (path ? String(path) : null)).reduce(
      (a, b) => join(a, b),
    );
  }

  protected buildPathWithQueryString(
    path: string,
    query?: Record<string, string | boolean | number | string[] | undefined>,
  ) {
    let encodedQuery: Record<string, string> | undefined;

    if (query)
      encodedQuery = Object.fromEntries(
        mapFilter(Object.entries(query), ([key, value]) => {
          if (Array.isArray(value)) return [key, value.join(",")];
          else if (value) return [key, value.toString()];
          return null;
        }),
      );
    const q = new URLSearchParams(encodedQuery);
    return format("%s?%s", path, q.toString());
  }

  static async getData<T extends object | number | string>(
    response: Promise<XiorResponse<T>>,
  ) {
    const { data } = await response;
    return data;
  }
}

export abstract class ApiImpl extends BaseApiImpl {
  constructor(protected readonly xior: XiorInstance) {
    super();
  }
}
