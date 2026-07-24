import type {
  raydium,
  buildTransactionResponseSchema,
  estimateOpenPositionFeeResponseSchema,
  buildOpenPositionTransactionResponseSchema,
} from "@rhivadotfun/api";

import { ApiImpl } from "../../api-impl";

export class CLMMAPI extends ApiImpl {
  protected path?: string = "/transactions/lp/raydium/clmm";

  estimateOpenPositionFee(
    params: ReturnType<typeof raydium.estimateOpenPositionFeeSchema.encode>,
  ) {
    return ApiImpl.getData(
      this.xior.post<
        ReturnType<typeof estimateOpenPositionFeeResponseSchema.encode>
      >(this.buildPath("/estimate-open-position-fee"), params),
    );
  }

  async buildTransaction(
    params: ReturnType<typeof raydium.buildTransactionSchema.encode>,
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
