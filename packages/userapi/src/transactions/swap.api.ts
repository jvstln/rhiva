import { ApiImpl } from "../api-impl";
import type {
  swapSchema,
  swapQuoteSchema,
  transactionResponseSchema,
} from "@rhivadotfun/api";

export default class SwapAPI extends ApiImpl {
  protected path: string = "/transactions/swap";

  getQuote(params: ReturnType<typeof swapQuoteSchema.encode>) {
    return ApiImpl.getData(
      this.xior.post<ReturnType<typeof swapSchema.encode>>(
        this.buildPath("/quote"),
        params,
      ),
    );
  }

  swap(params: ReturnType<typeof swapSchema.encode>) {
    return ApiImpl.getData(
      this.xior.post<ReturnType<typeof transactionResponseSchema.encode>>(
        this.buildPath("/send"),
        params,
      ),
    );
  }
}
