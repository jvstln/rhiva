import axios from "axios";
import { format } from "util";
import { queryOptions } from "@tanstack/react-query";

export type Token = {
  mint: string;
  image: string;
  symbol: string;
  name: string;
};

type GetTokenMultiParams = {
  mints: string[];
};

export const tokens = {
  multi: {
    queryKeys(params: Pick<GetTokenMultiParams, "mints">) {
      return ["tokens", "multi", ...params.mints];
    },
    async queryFn(params: GetTokenMultiParams) {
      const { data } = await axios.get<Token[]>(
        format(
          "https://dataapi.rhiva.fun/tokens?mints=%s",
          params.mints.join(","),
        ),
      );
      return data;
    },
    queryOptions(params: GetTokenMultiParams) {
      return queryOptions({
        queryKey: this.queryKeys(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
