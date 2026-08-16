import type { XiorInstance } from "xior";
import { WhirlpoolAPI } from ".";

export * from "./whirlpool.api";

export default class OrcaAPI {
	readonly whirlpool: WhirlpoolAPI;

	constructor(xior: XiorInstance) {
		this.whirlpool = new WhirlpoolAPI(xior);
	}
}
