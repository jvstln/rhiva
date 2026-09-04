"use client";

import { RewardsPage } from "@/features/reward/components/RewardsPage";
import {
  useLeaderboard,
  useRewardProfile,
} from "@/features/reward/reward.hook";

/**
 * Rewards page data owner: fetches the user's rewards profile and the global
 * leaderboard, then renders the pure-UI `<RewardsPage>` with both as props.
 */
export default function Rewards() {
  const rewardProfile = useRewardProfile();
  const leaderboard = useLeaderboard();

  return (
    <RewardsPage
      rewardProfile={rewardProfile}
      leaderboard={leaderboard}
    />
  );
}
