import { cache } from "react";
import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
      dehydrate: {
        shouldDehydrateQuery: defaultShouldDehydrateQuery,
      },
    },
  });
export const getQueryClient = cache(() => new QueryClient());
