import {
  Droplet,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sprout,
  TrendingDown,
  Users,
  Zap,
} from "lucide-react";

export const BADGE_ICONS = {
  users: Users,
  shield: ShieldCheck,
  zap: Zap,
  layers: Layers,
  droplet: Droplet,
  drop: TrendingDown,
  sprout: Sprout,
  refresh: RefreshCw,
};

export type BadgeIconName = keyof typeof BADGE_ICONS;

export interface Badge {
  icon: BadgeIconName;
  value: string;
  color: string;
}

export interface TokenRank {
  trophy: number;
  crown: string;
  users: number;
  clock: number;
  coins: string;
}

export interface Token {
  id: string;
  emoji: string;
  avatarBg: string;
  name: string;
  sub: string;
  age: string;
  address: string;
  ath: string;
  athChange: string;
  mc: string;
  mcProgress: number;
  price: string;
  priceChange: string;
  badges: Badge[];
  rank: TokenRank;
  txCount: number;
  volume: string;
}

export const mockTokens: Token[] = [
  {
    id: "1",
    emoji: "🐺",
    avatarBg: "bg-surface-2",
    name: "FLUKI",
    sub: "Fluki",
    age: "34m",
    address: "8m36...pump",
    ath: "$72.3K",
    athChange: "+35.1%",
    mc: "$53.5K",
    mcProgress: 62,
    price: "$9.7K",
    priceChange: "-81.77%",
    badges: [
      { icon: "users", value: "20%", color: "text-silver" },
      { icon: "shield", value: "DS", color: "text-info" },
      { icon: "zap", value: "0%", color: "text-muted-foreground" },
      { icon: "layers", value: "2%", color: "text-ocean-green" },
      { icon: "droplet", value: "0%", color: "text-muted-foreground" },
      { icon: "drop", value: "0.3%", color: "text-roman" },
      { icon: "sprout", value: "0%", color: "text-up" },
      { icon: "refresh", value: "0%", color: "text-muted-foreground" },
    ],
    rank: { trophy: 4, crown: "8/2977", users: 321, clock: 207, coins: "6.28" },
    txCount: 0,
    volume: "$0",
  },
  {
    id: "2",
    emoji: "🐸",
    avatarBg: "bg-surface-3",
    name: "PONKE",
    sub: "Ponke",
    age: "12m",
    address: "3xq1...bonk",
    ath: "$210K",
    athChange: "+118.4%",
    mc: "$182K",
    mcProgress: 88,
    price: "$96.2K",
    priceChange: "-47.2%",
    badges: [
      { icon: "users", value: "34%", color: "text-silver" },
      { icon: "shield", value: "DS", color: "text-info" },
      { icon: "zap", value: "3%", color: "text-roman" },
      { icon: "layers", value: "0%", color: "text-muted-foreground" },
      { icon: "droplet", value: "12%", color: "text-casablanca" },
      { icon: "drop", value: "0%", color: "text-muted-foreground" },
      { icon: "sprout", value: "100%", color: "text-up" },
      { icon: "refresh", value: "1%", color: "text-muted-foreground" },
    ],
    rank: {
      trophy: 12,
      crown: "142/5310",
      users: 1204,
      clock: 44,
      coins: "18.4",
    },
    txCount: 312,
    volume: "$41.2K",
  },
  {
    id: "3",
    emoji: "🐹",
    avatarBg: "bg-surface-2",
    name: "WOJAK",
    sub: "Wojak Classic",
    age: "2h",
    address: "9pfz...moon",
    ath: "$18.9K",
    athChange: "+6.7%",
    mc: "$14.1K",
    mcProgress: 35,
    price: "$6.3K",
    priceChange: "-55.4%",
    badges: [
      { icon: "users", value: "8%", color: "text-silver" },
      { icon: "shield", value: "DS", color: "text-info" },
      { icon: "zap", value: "0%", color: "text-muted-foreground" },
      { icon: "layers", value: "5%", color: "text-ocean-green" },
      { icon: "droplet", value: "0%", color: "text-muted-foreground" },
      { icon: "drop", value: "1.1%", color: "text-roman" },
      { icon: "sprout", value: "0%", color: "text-muted-foreground" },
      { icon: "refresh", value: "0%", color: "text-muted-foreground" },
    ],
    rank: { trophy: 2, crown: "3/1140", users: 89, clock: 302, coins: "1.02" },
    txCount: 5,
    volume: "$180",
  },
  {
    id: "4",
    emoji: "🦊",
    avatarBg: "bg-surface-3",
    name: "GIGA",
    sub: "Gigachad",
    age: "51m",
    address: "6vkd...chad",
    ath: "$412K",
    athChange: "+301.9%",
    mc: "$388K",
    mcProgress: 95,
    price: "$276K",
    priceChange: "-28.9%",
    badges: [
      { icon: "users", value: "18%", color: "text-silver" },
      { icon: "shield", value: "DS", color: "text-info" },
      { icon: "zap", value: "1%", color: "text-roman" },
      { icon: "layers", value: "4%", color: "text-ocean-green" },
      { icon: "droplet", value: "20%", color: "text-casablanca" },
      { icon: "drop", value: "0%", color: "text-muted-foreground" },
      { icon: "sprout", value: "100%", color: "text-up" },
      { icon: "refresh", value: "2%", color: "text-muted-foreground" },
    ],
    rank: {
      trophy: 31,
      crown: "9/2977",
      users: 3021,
      clock: 51,
      coins: "64.7",
    },
    txCount: 918,
    volume: "$212K",
  },
  {
    id: "5",
    emoji: "🐢",
    avatarBg: "bg-surface-2",
    name: "TURBO",
    sub: "Turbo Toad",
    age: "6m",
    address: "2jrn...pump",
    ath: "$9.4K",
    athChange: "+2.1%",
    mc: "$5.8K",
    mcProgress: 18,
    price: "$3.9K",
    priceChange: "-33.6%",
    badges: [
      { icon: "users", value: "41%", color: "text-roman" },
      { icon: "shield", value: "DS", color: "text-info" },
      { icon: "zap", value: "6%", color: "text-roman" },
      { icon: "layers", value: "0%", color: "text-muted-foreground" },
      { icon: "droplet", value: "0%", color: "text-muted-foreground" },
      { icon: "drop", value: "2.4%", color: "text-roman" },
      { icon: "sprout", value: "0%", color: "text-muted-foreground" },
      { icon: "refresh", value: "0%", color: "text-muted-foreground" },
    ],
    rank: { trophy: 1, crown: "820/6011", users: 27, clock: 6, coins: "0.14" },
    txCount: 2,
    volume: "$0",
  },
  {
    id: "6",
    emoji: "🐙",
    avatarBg: "bg-surface-3",
    name: "NEKO",
    sub: "Neko Coin",
    age: "3h",
    address: "7hbw...neko",
    ath: "$61.7K",
    athChange: "+41.8%",
    mc: "$44.9K",
    mcProgress: 71,
    price: "$29.4K",
    priceChange: "-19.2%",
    badges: [
      { icon: "users", value: "15%", color: "text-silver" },
      { icon: "shield", value: "DS", color: "text-info" },
      { icon: "zap", value: "0%", color: "text-muted-foreground" },
      { icon: "layers", value: "3%", color: "text-ocean-green" },
      { icon: "droplet", value: "8%", color: "text-casablanca" },
      { icon: "drop", value: "0.6%", color: "text-roman" },
      { icon: "sprout", value: "100%", color: "text-up" },
      { icon: "refresh", value: "0%", color: "text-muted-foreground" },
    ],
    rank: {
      trophy: 7,
      crown: "55/4402",
      users: 640,
      clock: 178,
      coins: "9.83",
    },
    txCount: 154,
    volume: "$18.6K",
  },
];
