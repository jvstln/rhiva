import type { Dex, Window, TokenFull } from "@rhivadotfun/dataapi";

import {
  _memeCache,
  _swapCache,
  _statsCache,
  _radarCache,
  _surgeCache,
  _metadataCache,
  _liquidityCache,
  _graduationCache,
  _poolCreateCache,
  _tokenCreateCache,
} from "@/cache";

export const WINDOWS: readonly Window[] = [
  "60",
  "300",
  "900",
  "1800",
  "3600",
  "7200",
  "14400",
  "21600",
  "43200",
  "86400",
  "259200",
  "604800",
] as const;

export const createDefaultStatsWindow = (
  value?: Partial<TokenFull["stats"][Window]>,
) => ({
  low: 0,
  open: 0,
  high: 0,
  close: 0,
  trades: 0,
  buys: 0,
  sells: 0,
  traders: 0,
  fees_usd: 0,
  volume_usd: 0,
  price_change_pct: 0,
  ...value,
});

export const createDefaultStats = (): TokenFull["stats"] => {
  const stats = {} as TokenFull["stats"];
  for (const window of WINDOWS) stats[window] = createDefaultStatsWindow();

  return stats;
};

export const createScreener = (
  value?: Partial<TokenFull["screener"]>,
): TokenFull["screener"] => ({
  is_graduated: false,
  bonding_pct: 0,
  dev_pct: 0,
  net_buy_usd: 0,
  organic_score: 0,
  fees_usd: 0,
  launchpad: null,
  socials: {
    any: false,
    x: false,
    telegram: false,
    website: false,
  },
  ...value,
});

export const createPool = (
  value: Partial<TokenFull["pools"][number]> & {
    pool: string;
    dex: Dex;
    quote_mint: string | null;
  },
): TokenFull["pools"][number] => ({
  trades: 0,
  traders: 0,
  price_usd: 0,
  liquidity_usd: 0,
  base_usd: 0,
  quote_usd: 0,
  tvl_usd: 0,
  base_reserve: 0,
  quote_reserve: 0,
  volume_usd: 0,
  fees_usd: 0,
  created_time: 0,
  lp_burn_pct: 0,
  virtual_base_reserve: 0,
  virtual_quote_reserve: 0,
  ...value,
});

export const createTokenFull = (
  value: Partial<TokenFull> & { mint: string },
): TokenFull => {
  const { mint, ...restValue } = value;

  const swaps = _swapCache.get(mint);
  const stats = _statsCache.get(mint);
  const radar = _radarCache.get(mint);
  const surge = _surgeCache.get(mint);
  const metadata = _metadataCache.get(mint);
  const pools = _poolCreateCache.get(mint);
  const tokenCreate = _tokenCreateCache.get(mint);
  const meme = _memeCache.get(mint);
  const graduation = _graduationCache.get(mint);
  const liquidity = _liquidityCache.get(mint);

  const lastSwap = swaps && swaps.length > 0 ? swaps[0] : undefined;

  const name =
    value.name ??
    metadata?.name ??
    tokenCreate?.name ??
    meme?.metadata?.name ??
    pools?.find((pool) => pool.name)?.name ??
    null;

  const symbol =
    value.symbol ??
    metadata?.symbol ??
    tokenCreate?.symbol ??
    meme?.metadata?.symbol ??
    pools?.find((pool) => pool.symbol)?.symbol ??
    null;

  const decimals =
    value.decimals ??
    metadata?.decimals ??
    meme?.metadata?.decimals ??
    swaps
      ?.map((swap) =>
        swap.quote_mint === mint ? swap.base_decimals : swap.quote_decimals,
      )
      .find((dec) => dec !== undefined) ??
    0;

  const uri =
    value.uri ??
    metadata?.uri ??
    tokenCreate?.uri ??
    meme?.metadata?.uri ??
    pools?.find((pool) => pool.uri)?.uri ??
    null;

  const image = value.image ?? meme?.metadata?.logo_uri ?? null;

  const description = value.description ?? meme?.metadata?.descriprion ?? null;

  const socials = {
    website:
      value.socials?.website ??
      metadata?.socials?.website ??
      meme?.metadata?.socials?.website ??
      null,
    x:
      value.socials?.x ??
      metadata?.socials?.x ??
      meme?.metadata?.socials?.x ??
      null,
    telegram:
      value.socials?.telegram ??
      metadata?.socials?.telegram ??
      meme?.metadata?.socials?.telegram ??
      null,
    discord: value.socials?.discord ?? meme?.metadata?.socials?.discord ?? null,
    youtube: value.socials?.youtube ?? meme?.metadata?.socials?.youtube ?? null,
    instagram:
      value.socials?.instagram ?? meme?.metadata?.socials?.instagram ?? null,
    tiktok: value.socials?.tiktok ?? meme?.metadata?.socials?.tiktok ?? null,
  };

  const launchpad =
    value.launchpad ?? graduation?.launchpad ?? meme?.launchpad ?? null;

  const creator =
    value.creator ??
    tokenCreate?.creator ??
    meme?.creator ??
    graduation?.creator ??
    null;

  const created_slot =
    value.created_slot ?? tokenCreate?.slot ?? graduation?.slot ?? null;

  const created_time =
    value.created_time ??
    tokenCreate?.block_time ??
    meme?.created_time ??
    graduation?.created_time ??
    null;

  const price_usd =
    value.price_usd ??
    stats?.price_usd ??
    meme?.price_usd ??
    lastSwap?.price_usd ??
    radar?.price_at_trigger ??
    surge?.price_at_trigger ??
    0;

  const price_native = value.price_native ?? lastSwap?.price ?? 0;

  const quote_mint =
    value.quote_mint ??
    lastSwap?.quote_mint ??
    tokenCreate?.quote_mint ??
    pools?.[0]?.quote_mint ??
    null;

  const supply = value.supply ?? meme?.metadata?.supply ?? 0;

  const market_cap_usd =
    value.market_cap_usd ??
    radar?.mcap_at_trigger ??
    surge?.mcap_at_trigger ??
    (supply && price_usd ? supply * price_usd : 0);

  const fdv_usd = value.fdv_usd ?? market_cap_usd;

  const defaultStats = createDefaultStats();
  if (stats?.windows) {
    for (const [winKey, winData] of Object.entries(stats.windows)) {
      const key = winKey as "300" | "3600";
      if (winData && defaultStats[key]) {
        defaultStats[key] = {
          ...defaultStats[key],
          trades: winData.trades,
          buys: winData.buys,
          sells: winData.sells,
          volume_usd: winData.volume_usd,
          price_change_pct: winData.price_change_pct,
        };
      }
    }
  }
  if (meme?.windows) {
    for (const [winKey, winData] of Object.entries(meme.windows)) {
      const key = winKey as "300" | "3600";
      if (winData && defaultStats[key]) {
        defaultStats[key] = {
          ...defaultStats[key],
          trades: winData.trades,
          buys: winData.buys,
          sells: winData.sells,
          volume_usd: winData.volume_usd,
          price_change_pct: winData.price_change_pct,
        };
      }
    }
  }
  if (value.stats) {
    for (const [winKey, winData] of Object.entries(value.stats)) {
      const key = winKey as Window;
      if (winData) {
        defaultStats[key] = {
          ...defaultStats[key],
          ...winData,
        };
      }
    }
  }

  const screener =
    value.screener !== undefined
      ? value.screener
      : graduation || meme
        ? createScreener({
            is_graduated: Boolean(graduation || meme?.graduated),
            bonding_pct: graduation ? 100 : (meme?.progress_pct ?? 0),
            launchpad,
            socials: {
              any: Boolean(socials.website || socials.x || socials.telegram),
              website: Boolean(socials.website),
              x: Boolean(socials.x),
              telegram: Boolean(socials.telegram),
            },
          })
        : null;

  const defaultSurge = surge
    ? {
        trigger_time: surge.trigger_time,
        mcap_at_trigger: surge.mcap_at_trigger,
        multiple: surge.multiple,
        mcap_change_since_trigger_pct:
          market_cap_usd && surge.mcap_at_trigger
            ? ((market_cap_usd - surge.mcap_at_trigger) /
                surge.mcap_at_trigger) *
              100
            : 0,
        ath_change_since_trigger_pct: 0,
      }
    : null;

  const defaultLiquidityUsd = liquidity
    ? liquidity.base_mint === mint
      ? liquidity.base_usd
      : liquidity.quote_usd
    : 0;

  const defaultPools =
    pools?.map((p) => ({
      pool: p.pool,
      dex: p.dex,
      quote_mint: p.quote_mint,
      price_usd,
      liquidity_usd: defaultLiquidityUsd,
      base_usd: 0,
      quote_usd: 0,
      tvl_usd: 0,
      virtual_base_reserve: 0,
      virtual_quote_reserve: 0,
      base_reserve: 0,
      quote_reserve: 0,
      volume_usd: 0,
      fees_usd: 0,
      trades: 0,
      traders: 0,
      created_time: p.block_time,
      lp_burn_pct: null,
    })) ?? [];

  return {
    mint,
    name,
    symbol,
    decimals,
    uri,
    image,
    description,
    socials,
    launchpad,
    creator,
    created_slot,
    created_time,
    price_usd,
    price_native,
    quote_mint,
    supply,
    market_cap_usd,
    fdv_usd,
    holders: value.holders ?? 0,
    top10_pct: value.top10_pct ?? 0,
    pools: value.pools ?? defaultPools,
    stats: defaultStats,
    intel: value.intel ?? null,
    screener,
    dev: value.dev ?? {
      wallet: creator,
      tokens_launched: 0,
    },
    ath_mcap_usd: value.ath_mcap_usd ?? null,
    indexed_from_creation: value.indexed_from_creation ?? false,
    history_from: value.history_from ?? false,
    surge: value.surge !== undefined ? value.surge : defaultSurge,
    liquidity_usd: value.liquidity_usd ?? defaultLiquidityUsd,
    tvl_usd: value.tvl_usd ?? 0,
    ...restValue,
  };
};
