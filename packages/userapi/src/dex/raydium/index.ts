import type { XiorInstance } from "xior";
import { CLMMAPI } from "./clmm.api";

export default class RaydiumAPI {
  readonly clmm: CLMMAPI;

  constructor(xior: XiorInstance) {
    this.clmm = new CLMMAPI(xior);
  }
}
