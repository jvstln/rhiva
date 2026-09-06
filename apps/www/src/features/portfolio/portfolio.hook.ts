import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dataapi } from "@/lib/dataapi";
import { queryClient } from "@/lib";
import { getTokenPortfolio } from "./portfolio.api";

export const useTokenPortfolio = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "tokenPortfolio", walletAddress],
    queryFn: () => getTokenPortfolio(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioWebSocket = (walletAddress?: string) => {
  useEffect(() => {
    if (!walletAddress) return;
    let cancelled = false;
    let unsubscriber: (() => void) | null = null;

    dataapi.ws
      .subscribe({ type: ["transfer"], address: [walletAddress] }, (event) => {
        if (event.type === "transfer") {
          queryClient.invalidateQueries({ queryKey: ["portfolio"] });
          queryClient.invalidateQueries({ queryKey: ["balance"] });
        }
      })
      .then((unsub) => {
        if (cancelled) {
          unsub();
        } else {
          unsubscriber = unsub;
        }
      })
      .catch((err) => {
        console.warn("[Portfolio WS Transfer Error]", err);
      });

    return () => {
      cancelled = true;
      if (unsubscriber) unsubscriber();
    };
  }, [walletAddress]);
};
