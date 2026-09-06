import { queryOptions } from "@tanstack/react-query";
import type { GetMoversParams } from "@rhivadotfun/dataapi";

import { dataapi } from "@/instance";

export const surgeQueries = {
  trending: {
    queryKey(params: GetMoversParams) {
      return ["surge", Object.entries(params)];
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
