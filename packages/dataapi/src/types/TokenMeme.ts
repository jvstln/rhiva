import type { LaunchPad } from "./LaunchPad";

export type TokenMeme = {
  mint: string;
  launchpad: LaunchPad;
  metadata: {
    name: string;
    symbol: string;
    uri: string;
    creator: string | null;
    decimals: number;
    suppy: number;
    logo_uri: string;
    descriprion: string;
    socials: {
      website: string | null;
      x: string | null;
      telegram: string | null;
      discord: string | null;
      youtube: string | null;
      instagram: string | null;
      tiktok: null;
    };
  };
  creator: string;
  created_time: number;
  graduated: false;
  progress_pct: number;
  price_usd: number;
  base_reserve: number;
  quote_reserve: number;
  block_time: number;
  windows: Record<
    300 | 3600,
    {
      volume_usd: number;
      trades: number;
      buys: number;
      sells: number;
      price_change_pct: number;
    }
  >;
};
