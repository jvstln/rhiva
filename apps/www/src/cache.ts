import { LRUCache } from "lru-cache";
import type {
  WsMemeEvent,
  WsSwapEvent,
  WsRadarEvent,
  WsSurgeEvent,
  WsStatsEvent,
  WsTransferEvent,
  WsMetadataEvent,
  WsLiquidityEvent,
  WsGraduationEvent,
  WsPoolCreateEvent,
  WsTokenCreateEvent,
} from "@rhivadotfun/dataapi";

const options = {
  ttl: 1000 * 60 * 5,
  ttlAutopurge: true,
};

export const _memeCache = new LRUCache<string, WsMemeEvent>(options);
export const _statsCache = new LRUCache<string, WsStatsEvent>(options);
export const _radarCache = new LRUCache<string, WsRadarEvent>(options);
export const _surgeCache = new LRUCache<string, WsSurgeEvent>(options);
export const _swapCache = new LRUCache<string, WsSwapEvent[]>(options);
export const _metadataCache = new LRUCache<string, WsMetadataEvent>(options);
export const _liquidityCache = new LRUCache<string, WsLiquidityEvent>(options);
export const _transferCache = new LRUCache<string, WsTransferEvent[]>(options);
export const _graduationCache = new LRUCache<string, WsGraduationEvent>(
  options,
);
export const _poolCreateCache = new LRUCache<string, WsPoolCreateEvent[]>(
  options,
);
export const _tokenCreateCache = new LRUCache<string, WsTokenCreateEvent>(
  options,
);
