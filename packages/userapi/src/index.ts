import { Xior, type XiorInstance } from "xior";
import { format } from "util";

import UserAPI from "./user.api";
import TransactionApi from "./transactions";
import NotificationAPI from "./notification.api";

export default class {
  private xior!: XiorInstance;
  readonly user: UserAPI;
  readonly transaction: TransactionApi;
  readonly notification: NotificationAPI;

  constructor(
    private readonly _baseURL: string,
    private _accessToken: string,
    private _wallet: string,
  ) {
    this.initXior();
    this.user = new UserAPI(this.xior);
    this.transaction = new TransactionApi(this.xior);
    this.notification = new NotificationAPI(this.xior);
  }

  initXior() {
    this.xior = Xior.create({
      baseURL: this._baseURL,
      headers: {
        authorization: format("Bearer %s", this._accessToken),
        "x-wallet-address": this._wallet,
      },
    });
  }

  set accessToken(value: string) {
    this._accessToken = value;
    this.initXior();
  }

  set wallet(value: string) {
    this._wallet = value;
    this.initXior();
  }
}
