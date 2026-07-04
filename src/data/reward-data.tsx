export interface RewardTier {
  id: string;
  name: string;
  multiplier: string;
  minXp: number;
  image: string;
}

// NOTE: source design showed "KING" at the same 5X multiplier as "QUEEN" — bumped
// to 5.5X here since that's almost certainly a copy typo in the original file.
export const REWARD_TIERS: RewardTier[] = [
  {
    id: "pup",
    name: "PUP",
    multiplier: "1x",
    minXp: 0,
    image: "/reward-tiers/tier-1.png",
  },
  {
    id: "ripple",
    name: "RIPPLE",
    multiplier: "1.5X",
    minXp: 4_999,
    image: "/reward-tiers/tier-2.png",
  },
  {
    id: "streamer",
    name: "STREAMER",
    multiplier: "2X",
    minXp: 12_000,
    image: "/reward-tiers/tier-3.png",
  },
  {
    id: "surfer",
    name: "SURFER",
    multiplier: "2.5X",
    minXp: 25_000,
    image: "/reward-tiers/tier-4.png",
  },
  {
    id: "guardian",
    name: "GUARDIAN",
    multiplier: "3X",
    minXp: 45_000,
    image: "/reward-tiers/tier-5.png",
  },
  {
    id: "knight",
    name: "KNIGHT",
    multiplier: "3.5x",
    minXp: 70_000,
    image: "/reward-tiers/tier-6.png",
  },
  {
    id: "duke",
    name: "DUKE",
    multiplier: "4X",
    minXp: 100_000,
    image: "/reward-tiers/tier-7.png",
  },
  {
    id: "lord",
    name: "LORD",
    multiplier: "4.5X",
    minXp: 140_000,
    image: "/reward-tiers/tier-8.png",
  },
  {
    id: "king",
    name: "KING",
    multiplier: "5.5X",
    minXp: 250_000,
    image: "/reward-tiers/tier-9.png",
  },
];

export interface RewardQuest {
  id: string;
  label: string;
  rewardXp: number;
  progressPercent: number;
  icon: "volume" | "transactions";
}

export const mockRewardAccount = {
  currentXp: 2_625,
  xpPerDay: 100,
  globalRank: 13_457,
  totalUsers: 24_239,
  totalStars: 0,
  referralLink: "https://app.lpagent.io/?referral=zN1cJo6",
  totalInvited: 12,
  totalEarnings: 0.8,
  minClaimAmount: 0.01,
};

export const mockRewardQuests: RewardQuest[] = [
  {
    id: "volume",
    label: "Trade 5 more SOL in Volume",
    rewardXp: 1_000,
    progressPercent: 62,
    icon: "volume",
  },
  {
    id: "transactions",
    label: "Make 10 more transactions",
    rewardXp: 200,
    progressPercent: 38,
    icon: "transactions",
  },
];
