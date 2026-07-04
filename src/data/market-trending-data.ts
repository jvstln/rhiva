export interface TrendingBadge {
  value: string;
  tone: "roman" | "ocean";
}

export interface TrendingRow {
  id: string;
  name: string;
  subtitle: string;
  age: string;
  followers: string;
  marketCap: string;
  marketCapChange: string;
  liquidity: string;
  volume: string;
  txns: number;
  buys: number;
  sells: number;
  trend: "up" | "down";
  badgesRow1: TrendingBadge[];
  badgesRow2: TrendingBadge[];
}

function makeRow(id: string, trend: "up" | "down"): TrendingRow {
  return {
    id,
    name: "Breeze",
    subtitle: "Breeze Coin",
    age: "1h",
    followers: "79",
    marketCap: "$73.5k",
    marketCapChange: "+23.45%",
    liquidity: "$16.8k",
    volume: "$39.3k",
    txns: 915,
    buys: 511,
    sells: 441,
    trend,
    badgesRow1: [
      { value: "99%", tone: "roman" },
      { value: "99% 7d", tone: "roman" },
      { value: "0%", tone: "ocean" },
      { value: "0%", tone: "ocean" },
    ],
    badgesRow2: [
      { value: "0%", tone: "ocean" },
      { value: "0%", tone: "ocean" },
      { value: "98.71%", tone: "roman" },
      { value: "", tone: "roman" },
    ],
  };
}

export const TRENDING_ROWS: TrendingRow[] = Array.from({ length: 6 }, (_, i) =>
  makeRow(`trending-${i}`, i % 2 === 0 ? "down" : "up"),
);

export const TIMEFRAME_OPTIONS = ["1m", "5m", "1h", "6h", "24h"] as const;
export const TABLE_COLUMNS = [
  "Pair Infor",
  "Market Cap",
  "Liquidity",
  "Volume",
  "TXNS",
  "Token Info",
  "Action",
] as const;

function chart(values: number[]) {
  return values.map((v, i) => ({ t: i, v }));
}

const sharedMetrics = (lpBurned: number) => [
  { id: "holders", label: "Top holders", value: 99, tone: "risk" },
  {
    id: "top10",
    label: "Top 10 holders (7d)",
    value: 99,
    suffix: "7d",
    tone: "risk",
  },
  { id: "airdrop", label: "Airdrop", value: 0, tone: "safe" },
  { id: "bundlers", label: "Bundlers", value: 0, tone: "safe" },
  { id: "devSold", label: "Dev sold", value: 0, tone: "safe" },
  { id: "freshWallets", label: "Fresh wallets", value: 0, tone: "safe" },
  { id: "lpBurned", label: "LP burned", value: lpBurned, tone: "risk" },
];

const UP_CHART = chart([10, 12, 11, 14, 16, 15, 18, 20, 19, 22]);
const DOWN_CHART = chart([22, 20, 21, 18, 19, 16, 15, 13, 14, 12]);

export const mockTrendingPairs = Array.from({ length: 7 }).map((_, i) => {
  const isUp = i % 2 === 0;

  return {
    id: `breeze-${i + 1}`,
    tokenName: "Breeze",
    tokenSymbol: "Breeze Coin",
    pairAddress: `${(3000 + i).toString(16)}...k29d`,
    iconColors: ["#22d3d3", "#ff2e77"],
    flagged: true,
    age: "1h",
    hasDevActivity: true,
    hasAlert: i % 3 === 0,
    hasWebsite: true,
    hasNote: i % 2 === 1,
    watcherCount: 79,
    chart: isUp ? UP_CHART : DOWN_CHART,
    changePercent: isUp ? 23.45 : -23.45,
    marketCap: 73_500,
    liquidity: 16_800,
    volume: 39_300,
    txnsTotal: 915,
    txnsBuys: 511,
    txnsSells: 441,
    metrics: sharedMetrics(98.71),
  };
});
