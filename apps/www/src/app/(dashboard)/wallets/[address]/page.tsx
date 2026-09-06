"use client";

import { useParams } from "next/navigation";
import { WalletTrackerPage } from "@/features/portfolio/components/WalletTrackerPage";
import { DEMO_WALLET_ADDRESS } from "@/features/portfolio/portfolio.demo";

export default function WalletDetailRoute() {
  const params = useParams<{ address: string }>();
  const address = params?.address || DEMO_WALLET_ADDRESS;

  return <WalletTrackerPage address={address} />;
}
