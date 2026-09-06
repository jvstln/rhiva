import type { Window } from "./Window";

export type WalletPnlPerformance<T extends Window> = {
  wallet: string;
  windows: Record<
    T,
    { realized_usd: number; trades: number; wins: number; losses: number }
  >;
  max_drawdown_pct: number;
  best_day_usd: number;
  worst_day_usd: number;
  days: number;
};
