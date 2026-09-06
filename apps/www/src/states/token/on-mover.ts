import type { TokenFull, WsMoverEvent } from "@rhivadotfun/dataapi";

import {
  createDefaultStats,
  createDefaultStatsWindow,
  createTokenFull,
} from "../defaults/token";
import { type State, insertOrMoveByRank } from "./utils";

type MoverRow = Extract<WsMoverEvent, { event: "snapshot" }>["rows"][number];
type MoverUpdate = Extract<WsMoverEvent, { event: "update" }>;

export const onMover = <T extends State>(state: T, event: WsMoverEvent) => {
  let tokens = state.tokens ? [...state.tokens] : [];

  const updateToken = (row: MoverRow | MoverUpdate, rank?: number) => {
    const index = tokens.findIndex((token) => token.mint === row.mint);

    if (index > -1) {
      const current = tokens[index];
      const stats = current.stats ? { ...current.stats } : createDefaultStats();
      stats["86400"] = createDefaultStatsWindow({
        ...stats["86400"],
        trades: row.trades || stats["86400"]?.trades,
        buys: row.buys || stats["86400"]?.buys,
        sells: row.sells || stats["86400"]?.sells,
        traders: row.traders || stats["86400"]?.traders,
        volume_usd: row.volume_usd || stats["86400"]?.volume_usd,
        price_change_pct:
          row.price_change_pct || stats["86400"]?.price_change_pct,
      });

      const token: TokenFull = {
        ...current,
        name: row.name || current.name,
        symbol: row.symbol || current.symbol,
        image: row.image || current.image,
        price_usd: row.price_usd || current.price_usd,
        market_cap_usd: row.market_cap_usd || current.market_cap_usd,
        fdv_usd: row.market_cap_usd || current.fdv_usd,
        liquidity_usd:
          row.liquidity_usd !== undefined
            ? row.liquidity_usd
            : current.liquidity_usd,
        created_time: row.created_time || current.created_time,
        stats,
      };

      tokens = insertOrMoveByRank(
        tokens,
        token,
        rank,
        (t) => t.mint === row.mint,
      );
    } else {
      // Create token even if it doesn't exist yet to make list real-time
      const stats = createDefaultStats();
      stats["86400"] = createDefaultStatsWindow({
        trades: row.trades,
        buys: row.buys,
        sells: row.sells,
        traders: row.traders,
        volume_usd: row.volume_usd,
        price_change_pct: row.price_change_pct,
      });

      const token = createTokenFull({
        mint: row.mint,
        name: row.name,
        symbol: row.symbol,
        image: row.image,
        price_usd: row.price_usd,
        market_cap_usd: row.market_cap_usd,
        fdv_usd: row.market_cap_usd,
        liquidity_usd: row.liquidity_usd,
        created_time: row.created_time,
        stats,
      });

      tokens = insertOrMoveByRank(
        tokens,
        token,
        rank,
        (t) => t.mint === row.mint,
      );
    }
  };

  if (event.event === "snapshot") {
    for (let i = 0; i < event.rows.length; i++) {
      const row = event.rows[i];
      updateToken(row, i + 1);
    }
    return { ...state, tokens };
  } else {
    updateToken(event, event.rank);
    return { ...state, tokens };
  }
};
