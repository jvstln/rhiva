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

export const PORTFOLIO_SUMMARY = {
  totalValue: "$25.32",
  totalValueChange: "-4.49%",
  unrealizedPnl: "$0",
  tradeableBalance: "$0",
  todaysPnl: "$0.00 (0.00%)",
};
