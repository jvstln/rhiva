export type Candle = {
  mint: string;
  pool: string;
  interval: "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "12h" | "24h";
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
  closed: boolean;
  type: "candle";
};
