export type TokenTransfer = {
  kind: "transfer";
  signature: string;
  slot: number;
  block_time: number;
  tx_index: number;
  ix_index: number;
  inner_ix_index: number;
  mint: string;
  src_owner: string;
  dst_owner: string;
  amount: number;
  decimals: number;
  indexed_at: number;
};
