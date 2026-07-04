export const POOL_DETAIL = {
  pair: "SOL/USDC",
  binStep: 1,
  fee: "0.001%",
  tokenA: { symbol: "SOL", balance: "3.73M", meta: "79 Token 2026" },
  tokenB: { symbol: "SOL", balance: "313.24M", meta: "99" },
  fees24h: "$4.01K",
  fees24hChange: "-50.59%",
  fees24hTvl: "20.15%",
  fees24hTvlChange: "+46.99%",
  currentPrice: "0.0000223 SOL/USDC",
  feeSchedule: [
    { label: "Bin Step", value: "100" },
    { label: "Base Fee", value: "3%" },
    { label: "Dynamic Fee", value: "0.0082546%" },
    { label: "Total Trading Fee", value: "2.0082546%" },
    { label: "Max Fee", value: "10%" },
    { label: "Protocol Fee", value: "0.20082546%" },
  ],
  feeCollectionToken: "Base + Quote",
  volume: "$156,824.69",
  tvlUsdc: { value: "19.36k", pct: "80.22%" },
  tvlSol: { value: "2.02k", pct: "8.90%" },
};

export const VOLUME_SERIES = [
  { day: "Jun 05", volume: 8 },
  { day: "Jun 06", volume: 12 },
  { day: "Jun 07", volume: 18 },
  { day: "Jun 08", volume: 30 },
  { day: "Jun 09", volume: 92 },
  { day: "Jun 10", volume: 46 },
  { day: "Jun 11", volume: 14 },
  { day: "Jun 12", volume: 9 },
];

export const TOKEN_INFO_COLUMNS = [
  { label: "Age", value: "2mo 21d" },
  { label: "Age", value: "2mo 21d" },
  { label: "Age", value: "2mo 21d", sub: "18.71%", subTone: "down" as const },
  { label: "Age", value: "2mo 21d", sub: "0%" },
];

// Liquidity bin distribution: left (SOL, green) vs right (USDC, purple) of current price.
export const LIQUIDITY_BINS = Array.from({ length: 48 }, (_, i) => ({
  bin: i,
  isSol: i < 22,
  height: 20 + Math.round(Math.abs(Math.sin(i / 3)) * 70),
}));
