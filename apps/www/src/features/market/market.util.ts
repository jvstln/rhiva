import type { Timeframe } from "./market.schema";
import type { RawToken } from "./market.token.type";

export function mapToken(raw: RawToken, filters?: { timeframe?: Timeframe }) {
  const safeRaw = raw || ({} as RawToken);
  const live = safeRaw.live ?? null;
  const rawHolders = safeRaw.holders ?? null;
  const social = safeRaw.social ?? null;
  const bonding = safeRaw.bonding ?? null;

  const currentTimeframe = filters?.timeframe
    ? safeRaw.timeframes?.windows?.[filters?.timeframe]
    : Object.values(safeRaw.timeframes?.windows ?? {})[0];

  const marketCapUsd = Number(
    safeRaw.market_cap_usd ??
      live?.dexscreener_market_cap_usd ??
      safeRaw.ath_mcap_usd ??
      0,
  );
  const marketCapSol = Number(safeRaw.market_cap_sol ?? 0);

  const volumeUsd = Number(currentTimeframe?.volume_usd ?? 0);
  const volumeSol = Number(currentTimeframe?.volume_sol ?? 0);

  const priceUsd = Number(
    safeRaw.price_usd ?? safeRaw.timeframes?.last_price_usd ?? 0,
  );

  const priceChangePct = Number(
    currentTimeframe?.price_change_pct ?? safeRaw.price_change_percent ?? 0,
  );

  const liquidityUsd = Number(
    safeRaw.liquidity_usd ?? live?.dexscreener_liquidity_usd ?? 0,
  );

  const bondingPct = Number(
    (
      bonding?.completion_pct ?? (safeRaw.stage === "completed" ? 100 : 0)
    ).toFixed(2),
  );

  const buys = Number(
    currentTimeframe?.buys ??
      safeRaw.buys ??
      (safeRaw as any).buy_24h ??
      (safeRaw as any).buy ??
      0,
  );
  const sells = Number(
    currentTimeframe?.sells ??
      safeRaw.sells ??
      (safeRaw as any).sell_24h ??
      (safeRaw as any).sell ??
      0,
  );

  return {
    ...safeRaw,
    mint: safeRaw.mint ?? (safeRaw as any).id ?? "",
    name: safeRaw.name ?? (safeRaw as any).token_name ?? "",
    symbol: safeRaw.symbol ?? (safeRaw as any).token_symbol ?? "",
    image: safeRaw.logo_uri ?? (safeRaw as any).image_url ?? "",
    logo_uri: safeRaw.logo_uri ?? (safeRaw as any).image_url ?? "",
    description: safeRaw.description,

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
      fresh: safeRaw.fresh_holdings ?? 0,
      ath: Number(0),
      totalBundlers: safeRaw.bundlers?.bundled_wallet_count ?? 0,
      bundledTotal: safeRaw.bundlers?.bundled_pct_of_early_sol ?? 0,
      bundledToken: Number(0),
      total: Number(rawHolders?.holder_count) || 0,

      dev_holder_pct: rawHolders?.dev_holder_pct,
      dev_balance: rawHolders?.dev_balance,
      last_update_ms: rawHolders?.last_update_ms,
    },

    socials: {
      twitterUrl: String(
        social?.twitter_url ?? (safeRaw as any).twitter_url ?? "",
      ),
      twitterHandle: String(
        social?.twitter_handle ?? (safeRaw as any).twitter_handle ?? "",
      ),
      telegramUrl: String(
        social?.telegram_url ?? (safeRaw as any).telegram_url ?? "",
      ),
      telegramHandle: String(
        (social as any)?.telegram_handle ??
          (safeRaw as any).telegram_handle ??
          "",
      ),
      websiteUrl: String(
        social?.website_url ?? (safeRaw as any).website_url ?? "",
      ),
    },

    bonding: {
      bondingPct,
      stage: bonding?.stage ?? safeRaw.stage ?? null,
      virtual_sol_reserves: bonding?.virtual_sol_reserves ?? null,
    },

    fees: {
      totalCashbackSol: safeRaw.timeframes?.fees?.total_cashback_sol ?? 0,
      totalFeeSol: safeRaw.timeframes?.fees?.total_fee_sol ?? 0,
    },

    totalSupply: Number(safeRaw.total_supply) || 0,
    timeframe: filters?.timeframe,
    timeframes: Object.keys(safeRaw.timeframes?.windows ?? {}) as Timeframe[],
    dexPaid: Number(0),
    viewCount: Number(0),
    marketCapUsd,
    marketCapSol,
    liquidityUsd,
    priceUsd,
    volumeUsd,
    volumeSol,
    athUsd: Number(safeRaw.ath_mcap_usd),
    priceChangePct,
    updatedAt: new Date(safeRaw.live?.updated_at ?? Date.now()),
    original: raw,

    buys,
    sells,
    totalTransaction: buys + sells,
    netBuyUsd: Number(0),
  };
}
