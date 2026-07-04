export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Deterministic pseudo-candles shaped like the reference chart (grind up, one big green push).
export const CANDLES: Candle[] = [
  {
    time: "10:05",
    open: 0.00069,
    high: 0.0007,
    low: 0.00068,
    close: 0.00069,
    volume: 900,
  },
  {
    time: "10:07",
    open: 0.00069,
    high: 0.0007,
    low: 0.00067,
    close: 0.00068,
    volume: 700,
  },
  {
    time: "10:09",
    open: 0.00068,
    high: 0.00071,
    low: 0.00068,
    close: 0.0007,
    volume: 1200,
  },
  {
    time: "10:11",
    open: 0.0007,
    high: 0.00072,
    low: 0.00069,
    close: 0.00069,
    volume: 950,
  },
  {
    time: "10:13",
    open: 0.00069,
    high: 0.0007,
    low: 0.00066,
    close: 0.00067,
    volume: 1400,
  },
  {
    time: "10:15",
    open: 0.00067,
    high: 0.00068,
    low: 0.0006,
    close: 0.00061,
    volume: 3600,
  },
  {
    time: "10:17",
    open: 0.00061,
    high: 0.00076,
    low: 0.00061,
    close: 0.00075,
    volume: 4200,
  },
  {
    time: "10:19",
    open: 0.00075,
    high: 0.00081,
    low: 0.00074,
    close: 0.00079,
    volume: 4600,
  },
  {
    time: "10:21",
    open: 0.00079,
    high: 0.0008,
    low: 0.0007,
    close: 0.00072,
    volume: 4900,
  },
  {
    time: "10:23",
    open: 0.00072,
    high: 0.00073,
    low: 0.00068,
    close: 0.0007,
    volume: 3800,
  },
  {
    time: "10:25",
    open: 0.0007,
    high: 0.00075,
    low: 0.00069,
    close: 0.00074,
    volume: 2400,
  },
  {
    time: "10:27",
    open: 0.00074,
    high: 0.00076,
    low: 0.00073,
    close: 0.00075,
    volume: 1900,
  },
  {
    time: "10:29",
    open: 0.00075,
    high: 0.00077,
    low: 0.00074,
    close: 0.00076,
    volume: 1500,
  },
  {
    time: "10:31",
    open: 0.00076,
    high: 0.00078,
    low: 0.00075,
    close: 0.00077,
    volume: 1600,
  },
  {
    time: "10:33",
    open: 0.00077,
    high: 0.0008,
    low: 0.00076,
    close: 0.00079,
    volume: 1700,
  },
  {
    time: "10:35",
    open: 0.00079,
    high: 0.00081,
    low: 0.00078,
    close: 0.0008,
    volume: 1300,
  },
  {
    time: "10:37",
    open: 0.0008,
    high: 0.00083,
    low: 0.00079,
    close: 0.00082,
    volume: 1400,
  },
  {
    time: "10:39",
    open: 0.00082,
    high: 0.00087,
    low: 0.00081,
    close: 0.00087,
    volume: 1800,
  },
];

export interface TradeRow {
  age: string;
  type: "Buy" | "Sell";
  mc: string;
  amount: string;
  totalUsd: string;
  gas: string;
  trader: string;
}

export const TRADES: TradeRow[] = Array.from({ length: 14 }, (_, i) => ({
  age: "2h",
  type: i % 5 === 3 || i % 5 === 4 ? "Sell" : "Buy",
  mc: "190k",
  amount: "44.1",
  totalUsd: "$0.008",
  gas: "$0.211",
  trader: "E38S...R41n",
}));

export const TRADE_TABS = [
  "Trades",
  "Positions",
  "Orders",
  "Holders(5)",
  "Top Traders",
  "Tracking",
  "DCA",
  "Liquidity Pool",
  "Dev Token(21)",
] as const;

export const HEADER_STATS = [
  { label: "Price", value: "$194.23K" },
  { label: "Liq", value: "$3.91K" },
  { label: "24h Vol", value: "$3.91K" },
  { label: "Total Fees", value: "$1.96K" },
  { label: "Total supply", value: "1B" },
  { label: "B. Curve", value: "99.21%", tone: "down" as const },
  { label: "Taxes", value: "Dex 0.25%" },
];

export const SECURITY_PRIMARY = [
  { label: "Top 10", value: "98.72%", tone: "down" as const },
  { label: "DEV", value: "98.71%", tone: "warning" as const },
  { label: "Holders", value: "40" },
  { label: "Snipers", value: "98.71%", tone: "down" as const },
];

export const SECURITY_SECONDARY = [
  { label: "Insiders", value: "0%" },
  { label: "Phishing", value: "0%" },
  { label: "Bundler", value: "0%" },
  { label: "Dex Paid", value: "Unpaid", tone: "down" as const },
];

export const SECURITY_AUDIT = [
  { label: "NoMint", ok: true },
  { label: "No Blacklist", ok: true },
  { label: "Burnt", value: "100%", ok: true },
  { label: "Rug %", value: "0%", ok: true },
];

export const AVATAR_REUSED = [
  { name: "TIKTOK", wallet: "7ZNv...a3yz", mc: "$16.9M", age: "6mo" },
  { name: "TIKTOK", wallet: "3Voe...YdYp", mc: "$14.9M", age: "5mo" },
  { name: "TIKTOK", wallet: "3EGK...SoVe", mc: "$12.7M", age: "5mo" },
];
