import type { Chain } from "./Chain";

export type TokenMetadata = {
  chain: Chain;
  address: string;
  is_metadata_mutable: boolean;
  creators: { address: string; verified: boolean; share: number }[];
  name: string;
  symbol: string;
  decimals: number;
  uri: string | null;
  supply: number;
  image: string;
  description: string | null;
  socials: {
    website: string | null;
    x: string | null;
    telegram: string | null;
    discord: string | null;
    youtube: string | null;
    instagram: string | null;
    tiktok: string | null;
  };
};
