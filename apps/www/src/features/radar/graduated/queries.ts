import { queryOptions } from "@tanstack/react-query";
import type { GetGraduatedParams } from "@rhivadotfun/dataapi";

import { dataapi } from "@/instance";

export const graduatedQueries = {
  trending: {
    queryKey(params: GetGraduatedParams) {
      return ["graduated", Object.entries(params)];
    },
    queryFn(params: GetGraduatedParams) {
      return dataapi.token.getGraduated(params);
    },
    queryOptions(params: GetGraduatedParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
