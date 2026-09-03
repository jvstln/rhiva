import type { LaunchPad } from "./LaunchPad";

export type TokenSearch = {
  mint: string;
  name: string;
  symbol: string;
  image: string | number;
  launchpad: LaunchPad;
  price_usd: number;
  liquidity_usd: number;
  created_time: number;
};

export type TokenSearchEnrich = TokenSearch & {
  description: string;
  socials: Record<
    | "website"
    | "x"
    | "telegram"
    | "discord"
    | "youtube"
    | "instagram"
    | "tiktok",
    string | null
  >;
};
