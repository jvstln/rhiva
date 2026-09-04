"use client";

import { PortfolioPage } from "@/features/portfolio/components/PortfolioPage";
import { useTokenPortfolio } from "@/features/portfolio/portfolio.hook";
import { useAuth } from "@/hooks";

/**
 * Portfolio page data owner. The portfolio endpoint is keyed by wallet, so the
 * wallet address is derived from auth state and the token-portfolio query is
 * passed down to `<PortfolioPage>` (pure UI). When unauthenticated the wallet
 * is empty, the query stays idle, and the page shows the auth prompt.
 */
export default function Portfolio() {
  const auth = useAuth();
  const walletAddress = auth.authenticated ? auth.activeWallet.address : "";
  const tokenPortfolio = useTokenPortfolio(walletAddress);

  return <PortfolioPage query={tokenPortfolio} />;
}
