import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "./env";
import z from "zod";
import { getRandomId } from "./utils";
import { get } from "lodash";

/**
 * useWebSocket
 * -----------------------------------------------------------------------
 * Manages a single native WebSocket connection with:
 *  - Auto-reconnect (exponential backoff + jitter)
 *  - A subscribe() API that queues/re-sends subscription payloads
 *    (so subscriptions survive reconnects transparently)
 *  - Per-channel message routing via a `channel` field you define
 *
 * Works as-is in Next.js (client components) and React Native/Expo,
 * since it only relies on the global `WebSocket` constructor.
 * -----------------------------------------------------------------------
 */

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closed"
  | "reconnecting";

type JSONValue = Record<string, unknown>;

type SubscriptionChannel =
  | "trades"
  | "surge"
  | "trending"
  | "trenches"
  | "pools"
  | "bonding"
  | "holders"
  | "liquidity"
  | "pools_all"
  | "launches";

type SubscriptionPayload = { channel: SubscriptionChannel; key?: string };
type SubscriptionResponse<T = z.JSONType> = {
  channel: SubscriptionChannel;
  data: T;
};

interface SubscriptionEntry<T = z.JSONType> {
  id: string;
  /** Payload sent to the server to (re)subscribe, e.g. { type: 'subscribe', channel, params } */
  payload: SubscriptionPayload;
  onMessage: (msg: SubscriptionResponse<T>) => void;
}

interface UseWebSocketOptions {
  /** Called once per successful open — after this fires all active subscriptions are resent */
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  /** Base delay for backoff in ms (default 500) */
  baseDelayMs?: number;
  /** Max backoff delay in ms (default 15000) */
  maxDelayMs?: number;
  /** Max reconnect attempts before giving up, 0 = infinite (default 0) */
  maxAttempts?: number;
  /** Auto-connect on mount (default true) */
  autoConnect?: boolean;
}

const log = (...messages: Parameters<typeof console.log>) =>
  console.log("[WebSocket]", ...messages);

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onOpen,
    onClose,
    onError,
    baseDelayMs = 500,
    maxDelayMs = 15000,
    maxAttempts = 0,
    autoConnect = true,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>("idle");

  const wsRef = useRef<WebSocket | null>(null);
  const subsRef = useRef<Map<string, SubscriptionEntry>>(new Map());
  const attemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manuallyClosedRef = useRef(false);

  const send = useCallback((payload: JSONValue) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }, []);

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const scheduleReconnect = () => {
    if (manuallyClosedRef.current) return;
    if (maxAttempts > 0 && attemptRef.current >= maxAttempts) {
      setStatus("closed");
      return;
    }
    const attempt = attemptRef.current++;
    const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
    const jitter = Math.random() * exp * 0.3;
    const delay = exp + jitter;

    setStatus("reconnecting");
    clearReconnectTimer();
    reconnectTimerRef.current = setTimeout(() => connect(), delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const connect = () => {
    clearReconnectTimer();
    manuallyClosedRef.current = false;
    setStatus(attemptRef.current > 0 ? "reconnecting" : "connecting");
    log(attemptRef.current > 0 ? "reconnecting" : "connecting");

    const ws = new WebSocket(env.webSocketApiUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      log("Connection open");
      attemptRef.current = 0;
      setStatus("open");
      onOpen?.();

      // resend every active subscription so the server state matches ours
      for (const sub of subsRef.current.values()) {
        ws.send(JSON.stringify(sub.payload));
      }
    };

    ws.onmessage = (event) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        // The deployed API can emit non-JSON frames (e.g. error frames whose
        // data field is unquoted); ignore them instead of throwing mid-socket.
        return;
      }
      const { data } = z.json().safeParse(parsed);
      log("Message received", event);

      for (const sub of subsRef.current.values()) {
        if (get(data, "type") === "subscribed") continue;
        const channel = get(data, "channel");
        if (typeof channel !== "string") continue;
        // Keyed feeds echo as `channel:key` (verified: `pools:<address>`),
        // unkeyed feeds echo the plain channel name — accept both, and
        // deliver keyed frames only to the subscription for that key so a
        // frame for one mint/pool can't leak into another's cache.
        const matches =
          channel === sub.payload.channel ||
          (channel.startsWith(`${sub.payload.channel}:`) &&
            (!sub.payload.key ||
              sub.payload.key ===
                channel.slice(sub.payload.channel.length + 1)));
        if (matches) {
          sub.onMessage(data as SubscriptionResponse);
        }
      }
    };

    ws.onerror = (ev) => {
      onError?.(ev);
    };

    ws.onclose = (ev) => {
      onClose?.(ev);
      wsRef.current = null;
      if (!manuallyClosedRef.current) {
        scheduleReconnect();
      } else {
        setStatus("closed");
      }
    };
  };

  const disconnect = () => {
    manuallyClosedRef.current = true;
    clearReconnectTimer();
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("closed");
  };

  /**
   * subscribe: registers a channel subscription, sends the payload immediately
   * if connected (or as soon as the socket opens/reconnects), and routes
   * matching messages to onMessage. Returns an unsubscribe function.
   */
  // Stable identities so consumer effects keyed on [channel, subscribe] only
  // re-run when their inputs actually change (not on every render).
  const subscribe = useCallback(
    function subscribe<T>(entry: Omit<SubscriptionEntry<T>, "id">) {
      log("Subscribing to", entry.payload.channel);
      const id = getRandomId();

      subsRef.current.set(id, { id, ...entry } as SubscriptionEntry);
      send({ action: "subscribe", ...entry.payload }); // no-op if not open yet; resent automatically on open

      return () => {
        const entry = subsRef.current.get(id);
        send({ action: "unsubscribe", ...entry?.payload });
        subsRef.current.delete(id);
      };
    },
    [send],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: connect is recreated per render and only the initial autoConnect is wanted
  useEffect(() => {
    if (autoConnect) connect();
    return () => {
      manuallyClosedRef.current = true;
      clearReconnectTimer();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [autoConnect]);

  return { ws: wsRef.current, status, connect, disconnect, subscribe, send };
}
