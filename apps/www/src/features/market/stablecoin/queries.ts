import type { Interval } from "@rhivadotfun/dataapi";
import { queryOptions } from "@tanstack/react-query";

import { dataapi } from "@/instance";
import stablecoins from "../../../../stablecoins.json";

type GetStableCoinParams = {
  interval: Interval;
};

export const stablecoinQueries = {
  stablecoins: {
    queryKeys(params: GetStableCoinParams) {
      return ["stablecoins", Object.entries(params)];
    },
    async queryFn(_params: GetStableCoinParams) {
      const promise = await Promise.allSettled(
        stablecoins.map((mint) => dataapi.token.getToken({ address: mint })),
      );
      return promise
        .filter((value) => value.status === "fulfilled")
        .map((value) => value.value);
    },
    queryOptions(params: GetStableCoinParams) {
      return queryOptions({
        queryKey: this.queryKeys(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
