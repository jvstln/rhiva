import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dataapi } from "@/lib/dataapi";
import { queryClient } from "@/lib";
import {
  getTokenPortfolio,
  getWalletBalance,
  getWalletFees,
  getWalletFunding,
  getWalletPnlHistory,
  getWalletPnlPerformance,
  getWalletTrades,
  getWalletTransfers,
} from "./portfolio.api";

export const useTokenPortfolio = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "tokenPortfolio", walletAddress],
    queryFn: () => getTokenPortfolio(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioBalance = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "balance", walletAddress],
    queryFn: () => getWalletBalance(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioHistory = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "history", walletAddress],
    queryFn: () => getWalletPnlHistory(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioPerformance = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "performance", walletAddress],
    queryFn: () => getWalletPnlPerformance(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioTrades = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "trades", walletAddress],
    queryFn: () => getWalletTrades(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioTransfers = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "transfers", walletAddress],
    queryFn: () => getWalletTransfers(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioFunding = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "funding", walletAddress],
    queryFn: () => getWalletFunding(walletAddress),
    enabled: !!walletAddress,
  });
};

export const usePortfolioFees = (walletAddress: string) => {
  return useQuery({
    queryKey: ["portfolio", "fees", walletAddress],
    queryFn: () => getWalletFees(walletAddress),
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
