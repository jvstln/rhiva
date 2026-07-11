import z from "zod";

export const PortfolioTab = z.enum(["tradingPosition", "liquidityPosition"]);
export type PortfolioTab = z.infer<typeof PortfolioTab>;

export const PNL_PROFIT_IMAGES = [
  "/pnl/pnl-profit-1.png",
  "/pnl/pnl-profit-2.png",
  "/pnl/pnl-profit-3.png",
];

export const PNL_LOSS_IMAGES = [
  "/pnl/pnl-loss-1.png",
  "/pnl/pnl-loss-2.png",
  "/pnl/pnl-loss-3.png",
];
