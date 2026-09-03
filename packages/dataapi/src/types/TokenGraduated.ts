import type { Dex } from "./Dex";
import type { LaunchPad } from "./LaunchPad";

export type TokenGraduated = {
  mint: string;
  name: string;
  symbol: string;
  launchpad: LaunchPad;
  graduated_time: number;
  pool: string;
  dex: Dex;
  price_usd: number;
  liquidity_usd: number;
};
