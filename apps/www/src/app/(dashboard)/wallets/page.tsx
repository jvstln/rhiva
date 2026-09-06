"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import { WalletTrackerPage } from "@/features/portfolio/components/WalletTrackerPage";
import { DEMO_WALLET_ADDRESS } from "@/features/portfolio/portfolio.demo";

function WalletsContent() {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const queryWallet = searchParams.get("address") || searchParams.get("wallet");

  const userWallet = auth.authenticated
    ? auth.activeWallet?.address
    : undefined;
  const address = queryWallet || userWallet || DEMO_WALLET_ADDRESS;

  return <WalletTrackerPage address={address} />;
}

export default function WalletsPage() {
  return (
    <Suspense fallback={null}>
      <WalletsContent />
    </Suspense>
  );
}
