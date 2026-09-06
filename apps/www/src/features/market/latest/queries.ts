import { queryOptions } from "@tanstack/react-query";
import type { GetLaunchesParams } from "@rhivadotfun/dataapi";

import { dataapi } from "@/instance";

export const latestQueries = {
  trending: {
    queryKey(params: GetLaunchesParams) {
      return ["latest", Object.entries(params)];
    },
    queryFn(params: GetLaunchesParams) {
      return dataapi.token.getLaunches(params);
    },
    queryOptions(params: GetLaunchesParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
