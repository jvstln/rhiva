import type { LaunchPad } from "./LaunchPad";

export type TokenLaunch = {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  creator: string;
  launchpad: LaunchPad;
  slot: number;
  block_time: number;
};
