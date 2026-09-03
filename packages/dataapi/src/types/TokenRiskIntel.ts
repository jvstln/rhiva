export type TokenRiskIntel = {
  mint: string;
  score: number;
  rugged: boolean;
  flags: {
    name: string;
    level: "warning";
    detail: string;
  }[];
  dev: {
    wallets: string;
    held: number;
    initial: number;
    held_pct: number;
    initial_pct: number;
    list: {
      wallet: string;
      initial: number;
      held: number;
      initial_pct: number;
      held_pct: number;
    }[];
  };
  snipers: {
    wallets: string;
    held: number;
    initial: number;
    held_pct: number;
    initial_pct: number;
    list: {
      wallet: string;
      initial: number;
      held: number;
      initial_pct: number;
      held_pct: number;
      slots_after_launch: number;
    }[];
  };
  bundlers: {
    wallets: string;
    held: number;
    initial: number;
    held_pct: number;
    initial_pct: number;
    list: {
      wallet: string;
      initial: number;
      held: number;
      initial_pct: number;
      held_pct: number;
      bundle_slot: number;
    }[];
  };
  insiders: {
    wallets: string;
    held: number;
    initial: number;
    held_pct: number;
    initial_pct: number;
    list: {
      wallet: string;
      initial: number;
      held: number;
      initial_pct: number;
      held_pct: number;
      slots_after_launch: number;
    }[];
  };
  fees: {
    total_sol: number;
    total_usd: number;
    tips_usd: number;
    trading_usd: number;
    total_paid_usd: number;
    venues: Record<
      "astralane" | "0slot" | "jito" | "nozomi" | "blockrazor",
      { sol: number; usd: number }
    >;
  };
};
