export type TokenSecurity = {
  mint: string;
  mint_authority: string | null;
  freeze_authority: string | null;
  token2022: boolean;
  metadata_mutable?: boolean;
  extensions: "transfer_fee_config" | "metadata_pointer"[];
  transfer_fee_pct: null | null;
  non_transferable: boolean;
  total_tax_pct: number;
  tax_breakdown: {
    transfer_fee_pct: number;
    swap_fee_pct: number;
    tip_pct: number;
  };
  creator: string | null;
  creator_pct: null;
  top10_pct: number;
};
