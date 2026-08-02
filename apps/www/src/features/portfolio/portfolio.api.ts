import { dataapi } from "@/lib";

export const getLiquidityPositions = async (walletAddress: string) => {
  const response = await dataapi.pools.getLpPortfolio(walletAddress);
  return response;
};

export const getTokenPortfolio = async (walletAddress: string) => {
  const response = await dataapi.tokens.getTokenPortfolio(walletAddress);
  return response;
};
