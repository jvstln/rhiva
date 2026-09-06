import { queryOptions } from "@tanstack/react-query";
import type { GetTrendingParams } from "@rhivadotfun/dataapi";

import { dataapi } from "@/instance";

export const trendingQueries = {
  trending: {
    queryKey(params: GetTrendingParams) {
      return ["trending", Object.entries(params)];
    },
    queryFn(params: GetTrendingParams) {
      return dataapi.token.getTrending(params);
    },
    queryOptions(params: GetTrendingParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
