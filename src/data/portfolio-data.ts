export interface Position {
  token: string;
  symbol: string;
  boughtUsd: string;
  boughtAmount: string;
  soldUsd: string;
  soldAmount: string;
  remainingUsd: string;
  remainingAmount: string;
  pnlUsd: string;
  pnlPct: string;
  holding: string;
}

export const POSITIONS: Position[] = Array.from({ length: 5 }, () => ({
  token: "Solana",
  symbol: "SOL",
  boughtUsd: "$5.9368",
  boughtAmount: "9,993.39 SOL",
  soldUsd: "$16.9573",
  soldAmount: "18.5k SOL",
  remainingUsd: "$4,567k",
  remainingAmount: "3,135.12 SOL",
  pnlUsd: "$14.5k Sol",
  pnlPct: "+201.8%",
  holding: "19h",
}));

export interface LpPosition {
  pool: string;
  timeAgo: string;
  badge?: string;
  pnlUsd: string;
  pnlPct: string;
  totalDeposit: string;
  totalWithdraw: string;
  totalFeesEarned: string;
}

export const LP_POSITIONS: LpPosition[] = [
  {
    pool: "WETH-SOL",
    timeAgo: "2hr ago",
    badge: "🔥",
    pnlUsd: "$0.07",
    pnlPct: "+2.06%",
    totalDeposit: "$3.46",
    totalWithdraw: "$3.48",
    totalFeesEarned: "$0.05",
  },
  {
    pool: "DBR-USDC",
    timeAgo: "5hr ago",
    badge: "🪙",
    pnlUsd: "$0.07",
    pnlPct: "+2.06%",
    totalDeposit: "$3.46",
    totalWithdraw: "$3.48",
    totalFeesEarned: "$0.05",
  },
  {
    pool: "DOG-USDC",
    timeAgo: "7hr ago",
    badge: "🌀",
    pnlUsd: "$0.07",
    pnlPct: "+2.06%",
    totalDeposit: "$3.46",
    totalWithdraw: "$3.48",
    totalFeesEarned: "$0.05",
  },
  {
    pool: "DBR-USDC",
    timeAgo: "5hr ago",
    badge: "🪙",
    pnlUsd: "$0.07",
    pnlPct: "+2.06%",
    totalDeposit: "$3.46",
    totalWithdraw: "$3.48",
    totalFeesEarned: "$0.05",
  },
  {
    pool: "WETH-SOL",
    timeAgo: "2hr ago",
    badge: "🔥",
    pnlUsd: "$0.07",
    pnlPct: "+2.06%",
    totalDeposit: "$3.46",
    totalWithdraw: "$3.48",
    totalFeesEarned: "$0.05",
  },
];

export const PORTFOLIO_SUMMARY = {
  totalValue: "$25.32",
  totalValueChange: "-4.49%",
  unrealizedPnl: "$0",
  tradeableBalance: "$0",
  todaysPnl: "$0.00 (0.00%)",
};

export const PNL_CALENDAR_METRICS = {
  totalNetWorth: "$0.0050",
  totalInvested: "$0.0050",
  feeEarned: "$0.0050",
  totalClosed: "0",
  monthsProfit: "$0.0050",
  winRate: "$0.0050",
  totalProfit: "$0.0050",
  totalLoss: "$0.0050",
};

export const PNL_CALENDAR_DAYS: Record<string, { pnl: number; positions: number }> = {
  "2025-07-02": { pnl: 41.16, positions: 3 },
  "2025-07-03": { pnl: 41.16, positions: 3 },
  "2025-07-05": { pnl: -0.51, positions: 3 },
  "2025-07-08": { pnl: 41.16, positions: 3 },
};
