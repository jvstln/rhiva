import type { Interval } from "@rhivadotfun/dataapi";
import { queryOptions } from "@tanstack/react-query";

import { dataapi } from "@/instance";
import stocks from "../../../../stocks.json";

type GetStockParams = {
  interval: Interval;
};

export const stablecoinQueries = {
  stablecoins: {
    queryKeys(params: GetStockParams) {
      return ["stocks", Object.entries(params)];
    },
    async queryFn(_params: GetStockParams) {
      const promise = await Promise.allSettled(
        stocks.map((mint) => dataapi.token.getToken({ address: mint })),
      );
      return promise
        .filter((value) => value.status === "fulfilled")
        .map((value) => value.value);
    },
    queryOptions(params: GetStockParams) {
      return queryOptions({
        queryKey: this.queryKeys(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
