import { format } from "util";
import xior, { type XiorInstance, type XiorRequestConfig } from "xior";

import { TokensApi } from "./tokens";
import { PoolsApi } from "./pools";

export interface DataApiClientConfig extends XiorRequestConfig {
	baseUrl: string;
}

export class DataApiClient {
	private client: XiorInstance;
	public tokens: TokensApi;
	public pools: PoolsApi;

	constructor(config: DataApiClientConfig) {
		const { baseUrl, ...xiorConfig } = config;
		this.client = xior.create({
			baseURL: baseUrl,
			...xiorConfig,
		});
		this.tokens = new TokensApi(this.client);
		this.pools = new PoolsApi(this.client);
	}

	private getStreamUrl(path: string, ...args: string[]): string {
		const base = this.client.defaults.baseURL || "";
		const separator = base.endsWith("/") ? "" : "/";
		const formattedPath = format(path, ...args);
		return format("%s%s%s", base, separator, formattedPath);
	}

	getTokenTradesStreamUrl(mint: string) {
		return this.getStreamUrl("token/%s/trades/stream", mint);
	}
	getLaunchesStreamUrl() {
		return this.getStreamUrl("launches/stream");
	}
	getPoolsStreamUrl() {
		return this.getStreamUrl("pools/stream");
	}
	getPoolStreamUrl(address: string) {
		return this.getStreamUrl("pools/%s/stream", address);
	}
}
