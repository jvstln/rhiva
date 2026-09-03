import { ApiImpl } from "../../api-impl";
import type { Pool, PoolDetail, PoolTvl, Window } from "../../types";
import type { GetPoolParams, GetPoolsParams, GetPoolTvlParams } from "./types";

export class PoolApi extends ApiImpl {
  protected override path = "data/pool";

  async getPool<T extends Window = Window>(params: GetPoolParams<T>) {
    return await ApiImpl.getData<PoolDetail<T>>(
      this.xior.get(
        this.buildPathWithQueryString(this.path, {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getPoolTvl(params: GetPoolTvlParams) {
    return await ApiImpl.getData<PoolTvl>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("tvl"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getPools(params: GetPoolsParams): Promise<Pool[]> {
    return await ApiImpl.getData<Pool[]>(
      this.xior.get(
        this.buildPathWithQueryString("data/pools", {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }
}
