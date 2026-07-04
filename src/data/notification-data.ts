export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  avatarUrl?: string;
  read?: boolean;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Price Alert: SOL",
    description:
      "SOL has surged +5.4% in the last 15 minutes, now trading at $148.50.",
    read: false,
  },
  {
    id: "2",
    title: "Liquidity Deposited",
    description:
      "Your position in SOL/USDC pool has been successfully initialized.",
    read: false,
  },
  {
    id: "3",
    title: "Reward Claimed",
    description:
      "You have successfully claimed 150.50 USDC in weekly reward incentives.",
    read: true,
  },
  {
    id: "4",
    title: "New Token Surge",
    description: "TikTok token market cap reached $231K ATH with high volume.",
    read: true,
  },
];
