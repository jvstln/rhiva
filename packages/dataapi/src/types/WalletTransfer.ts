export type WalletTransfer = {
  signature: string;
  slot: number;
  block_time: number;
  mint: string;
  kind: "transfer";
  direction: "in" | "out";
  counterparty: string;
  amount: number;
  decimals: number;
  value_usd: number;
};
