import type { Window, TokenFull, WsMemeEvent } from "@rhivadotfun/dataapi";

import { _metadataCache } from "@/cache";
import type { AddToTop, State } from "./utils";
import {
  createScreener,
  createTokenFull,
  createDefaultStatsWindow,
} from "../defaults/token";

export const onMeme = <T extends State>(
  state: T,
  event: WsMemeEvent,
  addToTop?: AddToTop<T> | boolean,
) => {
  const tokens = state.tokens ? [...state.tokens] : [];

  const index = tokens.findIndex((token) => token.mint === event.mint);
  if (index > -1) {
    const current = tokens[index];
    const cachedMeta = _metadataCache.get(event.mint);
    const price_usd = event.price_usd ? event.price_usd : current.price_usd;
    const supply = event.metadata.supply
      ? event.metadata.supply
      : current.supply;
    const market_cap_usd =
      supply && price_usd ? supply * price_usd : current.market_cap_usd;

    const x =
      event.metadata.socials.x || current.socials.x || cachedMeta?.socials?.x;
    const website =
      event.metadata.socials.website ||
      current.socials.website ||
      cachedMeta?.socials?.website;
    const telegram =
      event.metadata.socials.telegram ||
      current.socials.telegram ||
      cachedMeta?.socials?.telegram;

    const token: TokenFull = {
      ...current,
      supply,
      price_usd,
      market_cap_usd,
      fdv_usd: market_cap_usd,
      uri: (event.metadata.uri || current.uri || cachedMeta?.uri) ?? null,
      name: (event.metadata.name || current.name || cachedMeta?.name) ?? null,
      symbol:
        (event.metadata.symbol || current.symbol || cachedMeta?.symbol) ?? null,
      launchpad: event.launchpad ? event.launchpad : current.launchpad,
      creator: event.creator ? event.creator : current.creator,
      image:
        (event.metadata.logo_uri || current.image || cachedMeta?.logo_uri) ??
        null,
      decimals:
        event.metadata.decimals ??
        current.decimals ??
        cachedMeta?.decimals ??
        9,
      description: event.metadata.descriprion
        ? event.metadata.descriprion
        : current.description,

      created_time: event.created_time
        ? event.created_time
        : current.created_time,
      socials: {
        ...current.socials,
        x: x ?? null,
        website: website ?? null,
        telegram: telegram ?? null,
        discord: event.metadata.socials.discord
          ? event.metadata.socials.discord
          : current.socials.discord,
        youtube: event.metadata.socials.youtube
          ? event.metadata.socials.youtube
          : current.socials.youtube,
        instagram: event.metadata.socials.instagram
          ? event.metadata.socials.instagram
          : current.socials.instagram,
      },
      screener: createScreener({
        ...current.screener,
        bonding_pct: event.progress_pct,
        launchpad: event.launchpad,
        socials: {
          x: Boolean(x),
          website: Boolean(website),
          telegram: Boolean(telegram),
          any: Boolean(website || x || telegram),
        },
      }),
    };

    if (event.windows) {
      token.stats = { ...token.stats };
      for (const [key, value] of Object.entries(event.windows)) {
        const window = key as Window;
        const updates = {
          trades: value.trades,
          buys: value.buys,
          sells: value.sells,
          volume_usd: value.volume_usd,
          price_change_pct: value.price_change_pct,
        };
        if (value && token.stats[window]) {
          token.stats[window] = {
            ...token.stats[window],
            ...updates,
          };
        } else token.stats[window] = createDefaultStatsWindow(updates);
      }
    }

    tokens[index] = token;
    return { tokens };
  } else if (addToTop) {
    const supply = event.metadata.supply ? event.metadata.supply : 0;
    const price_usd = event.price_usd ? event.price_usd : 0;
    const market_cap_usd = supply * price_usd;
    const cachedMeta = _metadataCache.get(event.mint);

    const token = createTokenFull({
      mint: event.mint,
      name: event.metadata.name || cachedMeta?.name || "",
      symbol: event.metadata.symbol || cachedMeta?.symbol || "",
      image: event.metadata.logo_uri || cachedMeta?.logo_uri || null,
      uri: event.metadata.uri || cachedMeta?.uri || null,
      price_usd,
      launchpad: event.launchpad,
      creator: event.creator,
      created_time: event.created_time,
      market_cap_usd,
      socials: {
        x: event.metadata.socials.x,
        telegram: event.metadata.socials.telegram,
        tiktok: event.metadata.socials.tiktok,
        discord: event.metadata.socials.discord,
        youtube: event.metadata.socials.youtube,
        website: event.metadata.socials.website,
        instagram: event.metadata.socials.instagram,
      },
      stats: Object.fromEntries(
        Object.entries(event.windows).map(([key, value]) => {
          const stat = createDefaultStatsWindow({
            trades: value.trades,
            buys: value.buys,
            sells: value.sells,
            volume_usd: value.volume_usd,
            price_change_pct: value.price_change_pct,
          });
          return [key, stat];
        }),
      ) as TokenFull["stats"],
      screener: createScreener({
        is_graduated: event.progress_pct === 100,
        bonding_pct: event.progress_pct,
        launchpad: event.launchpad,
      }),
    });

    tokens.unshift(token);
    return { ...state, tokens };
  }

  return state;
};
