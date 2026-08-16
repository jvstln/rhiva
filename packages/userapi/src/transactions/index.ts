import type { XiorInstance } from "xior";

import DexAPI from "./lp";
import SwapAPI from "./swap.api";
import ActionAPI from "./action.api";

export default class TransactionApi {
  readonly dex: DexAPI;
  readonly swap: SwapAPI;
  readonly action: ActionAPI;

  constructor(xior: XiorInstance) {
    this.dex = new DexAPI(xior);
    this.swap = new SwapAPI(xior);
    this.action = new ActionAPI(xior);
  }
}
