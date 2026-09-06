"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PortfolioPage } from "@/features/portfolio/components/PortfolioPage";
import {
  usePortfolioWebSocket,
  useTokenPortfolio,
} from "@/features/portfolio/portfolio.hook";
import { useAuth } from "@/hooks";

export default function Portfolio() {
  const auth = useAuth();
  const router = useRouter();

  const walletAddress = auth.authenticated ? auth.activeWallet?.address : "";
  usePortfolioWebSocket(walletAddress);
  const tokenPortfolio = useTokenPortfolio(walletAddress);

  useEffect(() => {
    if (auth.ready && !auth.authenticated) {
      router.replace("/");
    }
  }, [auth.ready, auth.authenticated, router]);

  if (!auth.authenticated) {
    return null;
  }

  return <PortfolioPage query={tokenPortfolio} />;
}
