import { queryOptions } from "@tanstack/react-query";

import { dataapi } from "@/instance";

type GetWatchListParams = {
  mints: string[];
};

export const watchlistQueries = {
  trending: {
    queryKey(params: GetWatchListParams) {
      return ["watchlist", Object.entries(params)];
    },
    async queryFn(params: GetWatchListParams) {
      const promise = await Promise.allSettled(
        params.mints.map((mint) => dataapi.token.getToken({ address: mint })),
      );
      return promise
        .filter((value) => value.status === "fulfilled")
        .map((value) => value.value);
    },
    queryOptions(params: GetWatchListParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
