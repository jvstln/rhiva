import { useQuery } from "@tanstack/react-query";
import { getTokenPortfolio } from "./portfolio.api";

export const useTokenPortfolio = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "tokenPortfolio", walletAddress],
    queryFn: () => getTokenPortfolio(walletAddress),
    enabled: !!walletAddress,
  });
};
