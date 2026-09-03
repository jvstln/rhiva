import type { WalletTag } from "./WalletTag";

export type TokenFirstBuyer = {
  wallet: string;
  tags: WalletTag[];
  first_buy_signature: string;
  first_buy_slot: number;
  first_buy_time: number;
  first_buy_amount: number;
  first_buy_usd: number;
  slots_after_launch: number;
  bought: number;
  sold: number;
  holding: number;
  decimals: number;
  invested_usd: number;
  proceeds_usd: number;
  realized_usd: number;
  unrealized_usd: number;
};
