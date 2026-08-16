import type { XiorInstance } from "xior";
import { format } from "util";
import type {
  PoolRow,
  PoolsQuery,
  PoolDetail,
  LpPortfolioResponse,
} from "./types";

export class PoolsApi {
  constructor(private client: XiorInstance) {}

  private get<T>(url: string, params?: object) {
    return this.client.get<T>(url, { params }).then((res) => res.data);
  }

  getPoolDetail(address: string) {
    return this.get<PoolDetail | null>(format("/pools/%s", address));
  }
  getPools(query?: PoolsQuery) {
    return this.get<PoolRow[]>("/pools", query);
  }
  getLpPortfolio(wallet: string) {
    return this.get<LpPortfolioResponse>(format("/lp-portfolio/%s", wallet));
  }
}
