import { queryOptions } from "@tanstack/react-query";
import type { GetMoversParams } from "@rhivadotfun/dataapi";

import { dataapi } from "@/instance";

export const topGainersQueries = {
  trending: {
    queryKey(params: GetMoversParams) {
      return ["top-gainers", Object.entries(params)];
    },
    queryFn(params: GetMoversParams) {
      return dataapi.token.getMovers(params);
    },
    queryOptions(params: GetMoversParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
