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

export type SubscriptionType =
  | "swap"
  | "liquidity"
  | "token_create"
  | "graduating"
  | "graduated"
  | "pool_create"
  | "transfer"
  | "candle"
  | "stats"
  | "meme"
  | "graduation"
  | "surge"
  | "radar"
  | "metadata"
  | "launches"
  | "token_update"
  | "movers";

export type WsSubscribeQueryParams<
  T extends SubscriptionType | SubscriptionType[],
> = BaseWsSubscribeQueryParams & {
  type: T;
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

  subscribe<
    T extends SubscriptionType | SubscriptionType[],
    E = Extract<
      WsEvent,
      { type: T extends readonly string[] | string[] ? T[number] : T }
    >,
  >(
    params: WsSubscribeQueryParams<T>,
    onCallback: (event: E) => void,
    onDisconnect?: () => void,
  ): Promise<UnSubscribeFn> {
    return new Promise<UnSubscribeFn>((resolve, reject) => {
      let closed = false;
      let currentWs: WebSocket | null = null;
      let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
      let retryCount = 0;
      let hasResolved = false;

      const baseWs = this.url
        .replace(/^https:\/\//i, "wss://")
        .replace(/^http:\/\//i, "ws://")
        .replace(/\/+$/, "");

      const pathWithQuery = this.buildPathWithQueryString(this.path, {
        chain: "solana",
        api_key: this.apiKey,
        ...params,
      });

      const fullUrl = format("%s/%s", baseWs, pathWithQuery);

      const unsubscribe: UnSubscribeFn = () => {
        closed = true;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        if (currentWs) {
          currentWs.onopen = null;
          currentWs.onmessage = null;
          currentWs.onerror = null;
          currentWs.onclose = null;
          try {
            currentWs.close();
          } catch {}
          currentWs = null;
        }
      };

      const scheduleReconnect = () => {
        if (closed || reconnectTimer) return;
        const backoffMs = Math.min(1000 * 1.5 ** retryCount, 10_000);
        retryCount++;
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          if (!closed) {
            connect();
          }
        }, backoffMs);
      };

      const connect = () => {
        if (closed) return;

        try {
          const ws = new WebSocket(fullUrl);
          currentWs = ws;

          ws.onopen = () => {
            if (closed) {
              try {
                ws.close();
              } catch {}
              if (!hasResolved) {
                hasResolved = true;
                resolve(unsubscribe);
              }
              return;
            }
            retryCount = 0;
            try {
              ws.send(JSON.stringify({ filter: params }));
            } catch {}

            if (!hasResolved) {
              hasResolved = true;
              resolve(unsubscribe);
            }
          };

          ws.onmessage = (event: MessageEvent) => {
            if (closed) return;
            try {
              const data = JSON.parse(event.data) as E;
              onCallback(data);
            } catch {}
          };

          ws.onerror = (error) => {
            if (!hasResolved && retryCount > 5) {
              hasResolved = true;
              reject(error);
            }
          };

          ws.onclose = () => {
            onDisconnect?.();
            if (!closed) {
              scheduleReconnect();
            }
          };
        } catch (error) {
          if (!hasResolved && retryCount > 5) {
            hasResolved = true;
            reject(error);
          } else {
            scheduleReconnect();
          }
        }
      };

      connect();
    });
  }
}
