import xior, { type XiorInstance } from "xior";
import { PoolApi, TokenApi, WalletApi, WsApi } from "./routes";

export type DataApiConfig = {
  apiKey: string;
  baseURL?: string;
};

export class DataApi {
  private client: XiorInstance;

  readonly ws: WsApi;
  readonly pool: PoolApi;
  readonly token: TokenApi;
  readonly wallet: WalletApi;

  constructor({ baseURL = "https://api.solami.dev", apiKey }: DataApiConfig) {
    this.client = xior.create({ baseURL, headers: { "x-api-key": apiKey } });

    this.ws = new WsApi(baseURL, apiKey);
    this.pool = new PoolApi(this.client);
    this.token = new TokenApi(this.client);
    this.wallet = new WalletApi(this.client);
  }
}

export * from "./types";
export * from "./routes";

export default DataApi;
