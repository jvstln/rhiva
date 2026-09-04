import { useQuery } from "@tanstack/react-query";
import type UserApi from "@rhivadotfun/userapi";

import { useUserApi } from "@/hooks";

/**
 * The user's rewards profile — the return type of the `user.getMe()` API call.
 * `rewards/page.tsx` fetches it via `useRewardProfile()` and passes the query
 * down to `<RewardsPage>`.
 */
export type RewardProfile = Awaited<ReturnType<UserApi["user"]["getMe"]>>;

export function useRewardProfile() {
  const userApi = useUserApi();

  return useQuery({
    queryKey: ["rewards", "profile"],
    queryFn: () => userApi.user.getMe(),
    // enabled: !!userApi,
  });
}

export type LeaderboardEntry = {
  rank: number;
  wallet: string;
  totalPoints: number;
  dailyPoints: number;
  totalProfit: number;
  dailyProfit: number;
  isCurrentUser?: boolean;
};

const TOTAL_ENTRIES = 50;
const CURRENT_USER_RANK = 20;
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// Deterministic pseudo-random from a seed (0–1)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateWallet(index: number): string {
  let result = "";
  let seed = index * 7 + 13;
  for (let i = 0; i < 44; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    result += BASE58[seed % BASE58.length];
  }
  return result;
}

// TODO: replace with real leaderboard API
function getDummyLeaderboard(): LeaderboardEntry[] {
  return Array.from({ length: TOTAL_ENTRIES }, (_, i) => {
    const rank = i + 1;
    const r = (offset: number) => seededRandom(i * 31 + offset);

    // Points decay exponentially, with ±10 % variance
    const basePoints = Math.round(2_500_000 * 0.92 ** i);
    const totalPoints = Math.round(basePoints * (0.9 + 0.2 * r(0)));

    // Daily points ≈ 0.3–0.8 % of total
    const dailyPoints = Math.round(totalPoints * (0.003 + 0.005 * r(5)));

    // Profit = ±7 % of total, trending downward with rank
    const profitSign = r(11) > 0.38 ? 1 : -1;
    const totalProfit = Math.round(
      profitSign * totalPoints * 0.07 * (0.5 + 0.5 * r(17)),
    );

    // Daily profit is a fraction of total profit, sometimes flipped
    const dailySign = r(23) > 0.45 ? 1 : -1;
    const dailyProfit = Math.round(
      dailySign * Math.abs(totalProfit) * 0.03 * (0.3 + 0.7 * r(29)),
    );

    return {
      rank,
      wallet: generateWallet(i),
      totalPoints,
      dailyPoints,
      totalProfit,
      dailyProfit,
      isCurrentUser: rank === CURRENT_USER_RANK,
    };
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["rewards", "leaderboard"],
    queryFn: async (): Promise<LeaderboardEntry[]> => getDummyLeaderboard(),
  });
}
