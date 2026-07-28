import { Xior } from "xior";
import { format } from "util";

import DexAPI from "./dex";
import SwapAPI from "./swap.api";
import UserAPI from "./user.api";

export default class {
  readonly dex: DexAPI;
  readonly swap: SwapAPI;
  readonly user: UserAPI;

  constructor(baseURL: string, accessToken: string, wallet: string) {
    const xior = Xior.create({
      baseURL,
      headers: {
        authorization: format("Bearer %s", accessToken),
        "x-wallet-address": wallet,
      },
    });

    this.dex = new DexAPI(xior);
    this.swap = new SwapAPI(xior);
    this.user = new UserAPI(xior);
  }
}
