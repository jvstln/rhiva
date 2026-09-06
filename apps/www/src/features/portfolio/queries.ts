import { dataapi } from "@/instance";
import type {
  Window,
  GetWalletPnlParams,
  GetWalletBalanceParams,
  GetWalletPnlHistoryParams,
  GetWalletPnlPerformanceParams,
} from "@rhivadotfun/dataapi";
import { queryOptions } from "@tanstack/react-query";

export const porfolioQueries = {
  balance: {
    queryKey(params: GetWalletBalanceParams) {
      return ["balance", Object.entries(params)];
    },
    queryFn(params: GetWalletBalanceParams) {
      return dataapi.wallet.getBalance(params);
    },
    queryOptions(params: GetWalletBalanceParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
  pnl: {
    queryKey(params: GetWalletPnlParams) {
      return ["pnl", Object.entries(params)];
    },
    queryFn(params: GetWalletPnlParams) {
      return dataapi.wallet.getPnl(params);
    },
    queryOptions(params: GetWalletPnlParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
  pnlPerformance: {
    queryKey<T extends Window>(params: GetWalletPnlPerformanceParams<T>) {
      return ["pnl-performance", Object.entries(params)];
    },
    queryFn<T extends Window>(params: GetWalletPnlPerformanceParams<T>) {
      return dataapi.wallet.getPnlPerformance(params);
    },
    queryOptions<T extends Window>(params: GetWalletPnlPerformanceParams<T>) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
  pnlHistory: {
    queryKey(params: GetWalletPnlHistoryParams) {
      return ["pnl-history", Object.entries(params)];
    },
    queryFn(params: GetWalletPnlHistoryParams) {
      return dataapi.wallet.getPnlHistory(params);
    },
    queryOptions(params: GetWalletPnlHistoryParams) {
      return queryOptions({
        queryKey: this.queryKey(params),
        queryFn: () => this.queryFn(params),
      });
    },
  },
};
