import type { RawToken } from "./market.token.type";

export function mapToken(raw: RawToken) {
  const safeRaw = raw || ({} as RawToken);
  const live = safeRaw.live ?? null;
  const rawHolders = safeRaw.holders ?? null;
  const social = safeRaw.social ?? null;
  const bonding = safeRaw.bonding ?? null;

  // Extract / normalize timeframes
  const rawTimeframes = safeRaw.timeframes as any;
  const timeframesMap: Record<string, any> = {};

  if (rawTimeframes?.windows) {
    Object.keys(rawTimeframes.windows).forEach((tf) => {
      const w = rawTimeframes.windows[tf];
      timeframesMap[tf] = {
        ...w,
        volume_usd: w.volume_usd ?? null,
        trade_count: w.swaps ?? w.trade_count ?? 0,
        buy: w.buys ?? w.buy ?? 0,
        sell: w.sells ?? w.sell ?? 0,
        volume_buy_usd:
          w.volume_buy_usd ??
          (w.volume_usd && w.swaps ? w.volume_usd * (w.buys / w.swaps) : null),
        volume_sell_usd:
          w.volume_sell_usd ??
          (w.volume_usd && w.swaps ? w.volume_usd * (w.sells / w.swaps) : null),
        unique_wallet: w.traders ?? w.unique_wallet ?? 0,
        price_change_percent:
          w.price_change_pct ?? w.price_change_percent ?? null,
      };
    });
  } else if (rawTimeframes && typeof rawTimeframes === "object") {
    Object.assign(timeframesMap, rawTimeframes);
  }

  const marketCapUsd =
    safeRaw.market_cap_usd ??
    live?.dexscreener_market_cap_usd ??
    safeRaw.ath_mcap_usd ??
    0;

  const priceUsd =
    safeRaw.price_usd ??
    rawTimeframes?.last_price_usd ??
    live?.price_usd ??
    live?.dexscreener_price_usd ??
    0;

  const liquidityUsd =
    safeRaw.liquidity_usd ?? live?.dexscreener_liquidity_usd ?? 0;

  const bondingPct =
    bonding?.completion_pct ??
    (safeRaw.stage === "completed" ? 100 : 0);

  return {
    ...safeRaw,
    mint: safeRaw.mint ?? (safeRaw as any).id ?? "",
    name: safeRaw.name ?? (safeRaw as any).token_name ?? "",
    symbol: safeRaw.symbol ?? (safeRaw as any).token_symbol ?? "",
    image: safeRaw.logo_uri ?? (safeRaw as any).image_url ?? "",
    logo_uri: safeRaw.logo_uri ?? (safeRaw as any).image_url ?? "",
    description: safeRaw.description,
    market_cap_usd: marketCapUsd,
    price_usd: priceUsd,
    liquidity_usd: liquidityUsd,

    dev: {
      address: safeRaw.creator,
      fundedByAddress: safeRaw.creator,
      buys: (safeRaw as any).dev_buys ?? 0,
      sells: (safeRaw as any).dev_sells ?? 0,
      sellTransactions: (safeRaw as any).dev_sells ?? 0,
      buyTransactions: (safeRaw as any).dev_buys ?? 0,
      tokenBalance: Number(rawHolders?.dev_balance) || 0,
      migrated: Number(0),
      launched: Number(0),
    },

    holders: {
      ...rawHolders,
      top10:
        Number(rawHolders?.top10_holder_pct ?? safeRaw.whale_holdings) || 0,
      insiders: safeRaw.insiders?.insider_count ?? 0,
      phishings: Number(0),
      bundlers: safeRaw.bundlers?.bundled_wallet_count ?? 0,
      snipers: safeRaw.snipers?.sniper_count ?? safeRaw.sniper_holdings ?? 0,
      ath: Number(0),
      totalBundlers: safeRaw.bundlers?.bundled_wallet_count ?? 0,
      bundledTotal: safeRaw.bundlers?.bundled_pct_of_early_sol ?? 0,
      bundledToken: Number(0),
      total: Number(rawHolders?.holder_count) || 0,
      holder_count: rawHolders?.holder_count,
      top10_holder_pct: rawHolders?.top10_holder_pct ?? safeRaw.whale_holdings,
      dev_holder_pct: rawHolders?.dev_holder_pct,
      dev_balance: rawHolders?.dev_balance,
      last_update_ms: rawHolders?.last_update_ms,
    },

    socials: {
      twitterUrl: String(social?.twitter_url ?? (safeRaw as any).twitter_url ?? ""),
      twitterHandle: String(
        social?.twitter_handle ?? (safeRaw as any).twitter_handle ?? "",
      ),
      telegramUrl: String(social?.telegram_url ?? (safeRaw as any).telegram_url ?? ""),
      telegramHandle: String(
        (social as any)?.telegram_handle ?? (safeRaw as any).telegram_handle ?? "",
      ),
      websiteUrl: String(social?.website_url ?? (safeRaw as any).website_url ?? ""),
    },

    bonding: {
      completion_pct: bondingPct,
      stage: bonding?.stage ?? safeRaw.stage ?? null,
      virtual_sol_reserves: bonding?.virtual_sol_reserves ?? null,
    },

    timeframes: timeframesMap,
    totalSupply: Number(safeRaw.total_supply) || 0,
    totalTransaction: Number(0),
    timeframe: "1h",
    dexPaid: Number(0),
    bondingPercent: Number(bondingPct),
    viewCount: Number(0),
    marketCapUsd: Number(marketCapUsd),
    liquidityUsd: Number(liquidityUsd),
    priceUsd: Number(priceUsd),
    volumeUsd: Number(
      timeframesMap["24h"]?.volume_usd ?? timeframesMap["1h"]?.volume_usd ?? 0,
    ),
    priceChangePercent: Number(
      safeRaw.price_change_percent ??
        timeframesMap["24h"]?.price_change_percent ??
        timeframesMap["1h"]?.price_change_percent ??
        0,
    ),
    updatedAt: new Date(safeRaw.live?.updated_at ?? Date.now()),

    buys: safeRaw.buys ?? (safeRaw as any).buy_24h ?? (safeRaw as any).buy ?? 0,
    sells: safeRaw.sells ?? (safeRaw as any).sell_24h ?? (safeRaw as any).sell ?? 0,
  };
}

