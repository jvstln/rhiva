import type { XiorInstance } from "xior";

import { DLMMAPI } from "./dlmm.api";

export default class MeteoraAPI {
	readonly dlmm: DLMMAPI;

	constructor(xior: XiorInstance) {
		this.dlmm = new DLMMAPI(xior);
	}
}
