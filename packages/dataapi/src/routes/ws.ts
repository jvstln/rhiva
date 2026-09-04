import { format } from "util";
import { BaseApiImpl } from "../api-impl";
import type { Chain, Dex, WsEvent } from "../types";

export type UnSubscribeFn = () => void;

export type BaseWsSubscribeQueryParams = {
  chain?: Chain;
  address?: string[] | string;
  pool?: string[] | string;
  trader?: string[] | string;
  dex?: Dex[] | Dex;
  min_base?: number;
  min_quote?: number;
  min_volume_usd?: number;
  metadata?: boolean;
};

export type WsSubscribeQueryParams = BaseWsSubscribeQueryParams & {
  type:
    | "swap"
    | "liquidity"
    | "token_created"
    | "token_create"
    | "pool_create"
    | "transfer"
    | "candle"
    | "stats"
    | "meme"
    | "graduation"
    | "surge"
    | "radar"
    | "metadata";
  side?: "buy" | "sell";
  min_progress?: number;
  max_progress?: number;
  min_mcap_at_trigger?: number;
  max_mcap_at_trigger?: number;
  min_multiple?: number;
};

export class WsApi extends BaseApiImpl {
  protected override path = "data/subscribe";

  constructor(
    private readonly url: string,
    private readonly apiKey: string,
  ) {
    super();
  }

  subscribe(
    params: WsSubscribeQueryParams,
    onCallback: (event: WsEvent) => void,
    onDisconnect?: () => void,
  ): Promise<UnSubscribeFn> {
    return new Promise<UnSubscribeFn>((resolve, reject) => {
      let closed = false;

      const baseWs = this.url
        .replace(/^https:\/\//i, "wss://")
        .replace(/^http:\/\//i, "ws://")
        .replace(/\/+$/, String());

      const pathWithQuery = this.buildPathWithQueryString(this.path, {
        chain: "solana",
        api_key: this.apiKey,
        ...params,
      });

      const fullUrl = format("%s/%s", baseWs, pathWithQuery);

      let ws: WebSocket;
      try {
        ws = new WebSocket(fullUrl);
      } catch (error) {
        return reject(error);
      }

      const onMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as WsEvent;
          onCallback(data);
        } catch {}
      };

      const onClose = () => {
        onDisconnect?.();
      };

      ws.onerror = (event) => reject(event);
      ws.addEventListener("close", onClose);
      ws.addEventListener("message", onMessage);
      ws.onopen = () => {
        ws.send(JSON.stringify({ filter: params }));

        if (closed) {
          ws.close();
          return;
        }
        resolve(() => {
          closed = true;
          ws.removeEventListener("message", onMessage);
          ws.removeEventListener("close", onClose);
          ws.close();
        });
      };
    });
  }
}
