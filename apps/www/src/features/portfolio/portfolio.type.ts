import type { WalletPnl, WalletPnlWithPosition } from "@rhivadotfun/dataapi";

export interface PortfolioState {
  filter: string;
  setFilter: (filter: string) => void;
}

export type CalendarDay = {
  date: string;
  pnl_usd: number;
  roi_pct: number;
  trades_count?: number;
  event_count?: number;
};

export type PositionItem = WalletPnlWithPosition["positions"][number] & {
  symbol?: string;
  name?: string;
  image?: string;
  current_price_usd?: number;
};

export type PortfolioPnl = WalletPnl & {
  positions: PositionItem[];
  calendar?: CalendarDay[];
};
