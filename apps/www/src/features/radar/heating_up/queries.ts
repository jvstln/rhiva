import { queryOptions } from "@tanstack/react-query";
import type { GetGraduatingParams } from "@rhivadotfun/dataapi";

import { dataapi } from "@/instance";

export const heatingUpQueries = {
  trending: {
    queryKey(params: GetGraduatingParams) {
      return ["heating-up", Object.entries(params)];
    },
    queryFn(params: GetGraduatingParams) {
      return dataapi.token.getGraduating(params);
    },
    queryOptions(params: GetGraduatingParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
