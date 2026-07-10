import { api } from "@/lib/api";
import type { TokenResponseData } from "./market.type";

export const getTrendingTokens = async () => {
  const response = await api.get<{ data: TokenResponseData }>("/api/market");
  return response.data.data;
};
