import { format } from "util";
import { Xior, type XiorInstance } from "xior";

import TransactionApi from "./transactions";
import NotificationAPI from "./notification.api";
import * as PrimitiveUserAPI from "./user.api";

export default class UserAPI {
	private xior!: XiorInstance;
	readonly transaction: TransactionApi;
	readonly notification: NotificationAPI;
	readonly user: PrimitiveUserAPI.default;

	constructor(
		private readonly _baseURL: string,
		private _accessToken: string,
		private _wallet: string,
	) {
		this.initXior();
		this.transaction = new TransactionApi(this.xior);
		this.notification = new NotificationAPI(this.xior);
		this.user = new PrimitiveUserAPI.default(this.xior);
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
