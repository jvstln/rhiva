export interface MarketToken {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  marketCap: string;
  age: string;
  handle: string;
  followers: string;
  wallet: string;
  txCount: number;
  netFlow: string;
  metrics: {
    holdersPct: string;
    smartPct: string;
    dropletPct: string;
    stackPct: string;
  };
  risk: {
    bankPct: string;
    bundlePct: string;
    skullPct: string;
    snipePct: string;
  };
}

function makeToken(id: string): MarketToken {
  return {
    id,
    name: "Tik Tok",
    subtitle: "TikTok coin",
    volume: "$1.9K",
    marketCap: "$193.1K",
    age: "1h",
    handle: "@tiktok_us",
    followers: "2.4M",
    wallet: "AkSa...to5e",
    txCount: 58,
    netFlow: "+$1.9K",
    metrics: {
      holdersPct: "99%",
      smartPct: "99%",
      dropletPct: "0%",
      stackPct: "0%",
    },
    risk: {
      bankPct: "0%",
      bundlePct: "0%",
      skullPct: "68.71%",
      snipePct: "98.71%",
    },
  };
}

export const FRESH_TOKENS: MarketToken[] = Array.from({ length: 6 }, (_, i) =>
  makeToken(`fresh-${i}`),
);

export const HEATING_TOKENS: MarketToken[] = Array.from({ length: 6 }, (_, i) =>
  makeToken(`heating-${i}`),
);

export const GRADUATED_TOKENS: MarketToken[] = Array.from(
  { length: 6 },
  (_, i) => makeToken(`graduated-${i}`),
);

export const RADAR_TABS = [
  "Watchlist",
  "Radar",
  "Trending",
  "Surge",
  "Pump",
  "Live",
] as const;
