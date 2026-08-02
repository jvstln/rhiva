import { useQuery } from "@tanstack/react-query";
import { getLiquidityPositions, getTokenPortfolio } from "./portfolio.api";

export const useLiquidityPositions = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "liquidityPositions", walletAddress],
    queryFn: () => getLiquidityPositions(walletAddress),
    enabled: !!walletAddress,
  });
};

export const useTokenPortfolio = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "tokenPortfolio", walletAddress],
    queryFn: () => getTokenPortfolio(walletAddress),
    enabled: !!walletAddress,
  });
};
