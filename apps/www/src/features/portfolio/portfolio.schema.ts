import z from "zod";

export const PortfolioTab = z.enum([
  "tradingPosition",
  // "liquidityPosition"
]);
export type PortfolioTab = z.infer<typeof PortfolioTab>;

export const PNL_PROFIT_IMAGES = [
  "/pnl/pnl-profit-1.webp",
  "/pnl/pnl-profit-2.webp",
  "/pnl/pnl-profit-3.webp",
];

export const PNL_LOSS_IMAGES = [
  "/pnl/pnl-loss-1.webp",
  "/pnl/pnl-loss-2.webp",
  "/pnl/pnl-loss-3.webp",
];
