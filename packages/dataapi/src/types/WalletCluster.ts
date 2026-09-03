export type WalletCluster = {
  requested: number;
  resolved: number;
  clusters: {
    funder: string;
    funded: number;
    pct_of_requested: number;
    same_slot_funded: number;
    pct_funded_same_slot: number;
    wallets: {
      wallet: string;
      first_funded_slot: number;
      first_funded_time: number;
      first_funded_amount: number;
    }[];
  }[];
};
