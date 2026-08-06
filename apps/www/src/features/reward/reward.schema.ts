export interface RewardTier {
  name: string;
  multiplier: string;
  minXp: number;
  image: string;
}

export const REWARD_TIERS: RewardTier[] = [
  {
    name: "PUP",
    multiplier: "1x",
    minXp: 0,
    image: "/reward-tiers/tier-1.png",
  },
  {
    name: "RIPPLE",
    multiplier: "1.5X",
    minXp: 4_999,
    image: "/reward-tiers/tier-2.png",
  },
  {
    name: "STREAMER",
    multiplier: "2X",
    minXp: 12_000,
    image: "/reward-tiers/tier-3.png",
  },
  {
    name: "SURFER",
    multiplier: "2.5X",
    minXp: 25_000,
    image: "/reward-tiers/tier-4.png",
  },
  {
    name: "GUARDIAN",
    multiplier: "3X",
    minXp: 45_000,
    image: "/reward-tiers/tier-5.png",
  },
  {
    name: "KNIGHT",
    multiplier: "3.5x",
    minXp: 70_000,
    image: "/reward-tiers/tier-6.png",
  },
  {
    name: "DUKE",
    multiplier: "4X",
    minXp: 100_000,
    image: "/reward-tiers/tier-7.png",
  },
  {
    name: "LORD",
    multiplier: "4.5X",
    minXp: 140_000,
    image: "/reward-tiers/tier-8.png",
  },
  {
    name: "KING",
    multiplier: "5X",
    minXp: 250_000,
    image: "/reward-tiers/tier-9.png",
  },
];
