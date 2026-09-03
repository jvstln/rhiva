import type { LaunchPad } from "./LaunchPad";

export type TokenGraduating = {
  mint: string;
  name: string;
  symbol: string;
  launchpad: LaunchPad;
  progress_pct: number;
  price_usd: number;
  volume_usd: number;
  created_time: number;
};
