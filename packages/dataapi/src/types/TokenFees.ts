export type TokenFees = {
  mint: string;
  total_sol: number;
  total_usd: number;
  tips_usd: number;
  trading_usd: number;
  total_paid_usd: number;
  venues: Record<
    | "jito"
    | "astralane"
    | "0slot"
    | "jito"
    | "nozomi"
    | "blockrazor"
    | "axiom"
    | "bonkbot"
    | "gmgn"
    | "trojan"
    | "photon"
    | "bloxroute"
    | "network",
    { sol: number; usd: number } | null
  >;
};
