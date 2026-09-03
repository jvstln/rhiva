import type { LaunchPad } from "./LaunchPad";

export type TokenCreation = {
  mint: string;
  creator: string;
  launchpad: LaunchPad;
  signature: string;
  slot: number;
  block_time: number;
  name: string;
  symbol: string;
  uri: string;
};
