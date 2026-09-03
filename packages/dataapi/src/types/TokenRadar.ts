export type Radar = {
  mint: string;
  trigger_time: number;
  mcap_at_trigger: number;
  price_at_trigger: number;
  volume_window_usd: number;
  baseline_usd: number;
  multiple: number;
  trades: number;
  traders_est: number;
  window_secs: number;
  type: "radar";
};
