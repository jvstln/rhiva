import { Timeframe } from "./market.schema";
import type { Token } from "./market.token.type";

export function mapToToken(raw: any): Token {
  if (!raw || typeof raw !== "object") return raw;

  const token: Token = {
    mint: raw.mint ?? raw.address ?? raw.token_address,
    name: raw.name ?? raw.token_name,
    symbol: raw.symbol ?? raw.token_symbol,
    logo_uri: raw.logo_uri ?? raw.image_url,
    description: raw.description,
    creator: raw.creator,
    global_fees_paid: raw.global_fees_paid ?? raw.global_fees_paid,
    total_supply: raw.total_supply,
    pair_address: raw.pair_address,
    created_at: raw.created_at,
    pool_created_at: raw.pool_created_at,
    decimals: raw.decimals,
    buys: raw.buys ?? raw.buy_24h ?? raw.buy,
    sells: raw.sells ?? raw.sell_24h ?? raw.sell,
    price_change_percent:
      raw.price_change_percent ?? raw.price_change_24h_percent ?? null,
    live: raw.live ?? null,
    holders: raw.holders ?? null,
    social: raw.social ?? null,
    bonding: raw.bonding ?? null,
    recent_listing_time:
      raw.recent_listing_time ?? raw.last_trade_unix_time ?? null,
    audit_score: raw.audit_score,
    bundled_supply: raw.bundled_supply,
    whale_holdings: raw.whale_holdings,
    sniper_holdings: raw.sniper_holdings,
    bot_activity: raw.bot_activity,
  };

  // Map timeframe metrics: prefer nested `timeframes` if provided
  const timeframes: Partial<Record<Timeframe, any>> = {};

  if (raw.timeframes && typeof raw.timeframes === "object") {
    Object.keys(raw.timeframes).forEach((k) => {
      timeframes[k as Timeframe] = raw.timeframes[k];
    });
  } else {
    // Build from flattened keys like volume_24h_usd, trade_24h_count, buy_24h, etc.
    Timeframe.options.forEach((tf) => {
      const frame: any = {};
      const volumeKey = `volume_${tf}_usd`;
      const tradeKey = `trade_${tf}_count`;
      const buyKey = `buy_${tf}`;
      const sellKey = `sell_${tf}`;
      const volumeBuyKey = `volume_buy_${tf}_usd`;
      const volumeSellKey = `volume_sell_${tf}_usd`;
      const uniqueWalletKey = `unique_wallet_${tf}`;
      const priceChangeKey = `price_change_${tf}_percent`;

      if (
        raw[volumeKey] !== undefined ||
        raw[tradeKey] !== undefined ||
        raw[buyKey] !== undefined ||
        raw[sellKey] !== undefined ||
        raw[volumeBuyKey] !== undefined ||
        raw[volumeSellKey] !== undefined ||
        raw[uniqueWalletKey] !== undefined ||
        raw[priceChangeKey] !== undefined
      ) {
        frame.volume_usd = raw[volumeKey] ?? null;
        frame.trade_count = raw[tradeKey] ?? 0;
        frame.buy = raw[buyKey] ?? raw.buys ?? 0;
        frame.sell = raw[sellKey] ?? raw.sells ?? 0;
        frame.volume_buy_usd = raw[volumeBuyKey] ?? null;
        frame.volume_sell_usd = raw[volumeSellKey] ?? null;
        frame.unique_wallet =
          raw[uniqueWalletKey] ?? raw.unique_wallet_24h ?? 0;
        frame.price_change_percent = raw[priceChangeKey] ?? null;
        timeframes[tf] = frame;
      }
    });
  }

  if (Object.keys(timeframes).length > 0) token.timeframes = timeframes;

  // map surge / raw fields if present
  if (raw.ath_mcap_usd !== undefined) token.ath_mcap_usd = raw.ath_mcap_usd;
  if (raw.ath_mcap !== undefined) token.ath_mcap_usd = raw.ath_mcap;
  if (raw.last_surge_pct !== undefined) token.last_surge_pct = raw.last_surge_pct;
  if (raw.last_surge_pct === undefined && raw.pct_since_entry !== undefined)
    token.last_surge_pct = raw.pct_since_entry;
  if (raw.rank !== undefined) token.rank = String(raw.rank);
  if (raw.stage !== undefined && token.rank === undefined) token.rank = String(raw.stage);

  return token as Token;
}

export default mapToToken;
