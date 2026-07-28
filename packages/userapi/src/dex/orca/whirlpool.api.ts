import type {
  orca,
  buildTransactionResponseSchema,
  estimateOpenPositionFeeResponseSchema,
  buildOpenPositionTransactionResponseSchema,
} from "@rhivadotfun/api";

import { ApiImpl } from "../../api-impl";

export class WhirlpoolAPI extends ApiImpl {
  protected path?: string = "/transactions/lp/orca/whirlpool";

  estimateOpenPositionFee(
    params: ReturnType<typeof orca.estimateOpenPositionFeeSchema.encode>,
  ) {
    return ApiImpl.getData(
      this.xior.post<
        ReturnType<typeof estimateOpenPositionFeeResponseSchema.encode>
      >(this.buildPath("/estimate-open-position-fee"), params),
    );
  }

  async buildTransaction(
    params: ReturnType<typeof orca.buildTransactionSchema.encode>,
  ) {
    const data = await ApiImpl.getData(
      this.xior.post(this.buildPath("/build-transaction"), params),
    );
    if (params.action === "open-position")
      return data as ReturnType<
        typeof buildOpenPositionTransactionResponseSchema.encode
      >;
    else
      return data as ReturnType<typeof buildTransactionResponseSchema.encode>;
  }
}
