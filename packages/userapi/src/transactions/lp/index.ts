import type { XiorInstance } from "xior";

import OrcaAPI from "./orca";
import MeteoraAPI from "./meteora";
import RaydiumAPI from "./raydium";

export default class DexAPI {
	readonly orca: OrcaAPI;
	readonly meteora: MeteoraAPI;
	readonly raydium: RaydiumAPI;

	constructor(xior: XiorInstance) {
		this.orca = new OrcaAPI(xior);
		this.meteora = new MeteoraAPI(xior);
		this.raydium = new RaydiumAPI(xior);
	}
}
