"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { RewardsPage } from "@/features/reward/components/RewardsPage";
import {
  useLeaderboard,
  useRewardProfile,
} from "@/features/reward/reward.hook";
import { useAuth } from "@/hooks";

export default function Rewards() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.ready && !auth.authenticated) {
      router.replace("/");
    }
  }, [auth.ready, auth.authenticated, router]);

  if (!auth.authenticated) {
    return null;
  }

  const rewardProfile = useRewardProfile();
  const leaderboard = useLeaderboard();

  return (
    <RewardsPage
      rewardProfile={rewardProfile}
      leaderboard={leaderboard}
    />
  );
}
