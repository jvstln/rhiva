import type { Window } from "./Window";

export type WalletPnlPerformance = {
  wallet: string;
  windows: Record<
    Window,
    { realized_usd: number; trades: number; wins: number; losses: number }
  >;
  max_drawdown_pct: number;
  best_day_usd: number;
  worst_day_usd: number;
  days: number;
};
