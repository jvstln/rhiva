import type { Dex } from "./Dex";

export type TokenDuplicate = {
  mint: string;
  name: string;
  symbol: string;
  creator: string;
  created_time: number;
  count: string;
  truncated: boolean;
  duplicates: [
    {
      mint: string;
      name: string;
      symbol: string;
      creator: string;
      dex: Dex;
      created_time: number;
      matched: "both";
      earlier: boolean;
    },
  ];
  image_hash: string;
  avatar_reused_by: string[];
};
