export type WalletFunding = {
  wallet: string;
  first_funder: string;
  first_funded_signature: string;
  first_funded_time: number;
  first_funded_slot: number;
  first_funded_amount: number;
  funders: { wallet: string; total: number; transfers: number }[];
};
