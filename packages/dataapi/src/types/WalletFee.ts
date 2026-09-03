import type { FeeVenue } from "./FeeVenue";

export type WalletFee = {
  wallet: string;
  total_sol: number;
  tips_usd: number;
  trading_usd: number;
  total_paid_usd: number;
  venues: Record<FeeVenue, { sol: number; usd: number }>;
};
