import type { TokenFull, WsTokenUpdateEvent } from "@rhivadotfun/dataapi";
import { createDefaultStatsWindow } from "../defaults/token";
import type { State } from "./utils";

export const onTokenUpdate = <T extends State>(
  state: T,
  event: WsTokenUpdateEvent,
) => {
  if (!state.tokens) return state;
  const index = state.tokens.findIndex((token) => token.mint === event.mint);
  if (index === -1) return state;

  const current = state.tokens[index];
  const price_usd = event.price_usd || current.price_usd;
  const market_cap_usd =
    event.mcap_usd ||
    (current.supply && price_usd
      ? current.supply * price_usd
      : current.market_cap_usd);
  const liquidity_usd =
    event.liquidity_usd !== undefined
      ? event.liquidity_usd
      : current.liquidity_usd;

  const token: TokenFull = {
    ...current,
    price_usd,
    price_native:
      event.price_native !== undefined
        ? event.price_native
        : current.price_native,
    market_cap_usd,
    fdv_usd: market_cap_usd,
    liquidity_usd,
    stats: { ...current.stats },
  };

  if (event.volume_5m_usd !== undefined || event.trades_5m !== undefined) {
    const stat300 = token.stats["300"] ?? createDefaultStatsWindow();
    token.stats["300"] = {
      ...stat300,
      volume_usd:
        event.volume_5m_usd !== undefined
          ? event.volume_5m_usd
          : stat300.volume_usd,
      trades: event.trades_5m !== undefined ? event.trades_5m : stat300.trades,
      buys: event.buys_5m !== undefined ? event.buys_5m : stat300.buys,
      sells: event.sells_5m !== undefined ? event.sells_5m : stat300.sells,
      close: price_usd,
    };
  }

  if (event.volume_1h_usd !== undefined || event.trades_1h !== undefined) {
    const stat3600 = token.stats["3600"] ?? createDefaultStatsWindow();
    token.stats["3600"] = {
      ...stat3600,
      volume_usd:
        event.volume_1h_usd !== undefined
          ? event.volume_1h_usd
          : stat3600.volume_usd,
      trades: event.trades_1h !== undefined ? event.trades_1h : stat3600.trades,
      close: price_usd,
    };
  }

  if (event.pool && token.pools) {
    token.pools = token.pools.map((pool) => {
      if (pool.pool === event.pool) {
        return {
          ...pool,
          price_usd,
          liquidity_usd:
            liquidity_usd !== undefined ? liquidity_usd : pool.liquidity_usd,
        };
      }
      return pool;
    });
  }

  const tokens = [...state.tokens];
  tokens[index] = token;
  return { tokens };
};
