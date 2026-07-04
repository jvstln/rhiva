import {
  BadgeCheck,
  Clock,
  Coins,
  Copy,
  Crown,
  Droplet,
  Layers,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Sprout,
  TrendingDown,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BADGE_ICONS = {
  users: Users,
  shield: ShieldCheck,
  zap: Zap,
  layers: Layers,
  droplet: Droplet,
  drop: TrendingDown,
  sprout: Sprout,
  refresh: RefreshCw,
};

type BadgeIconName = keyof typeof BADGE_ICONS;

interface Badge {
  icon: BadgeIconName;
  value: string;
  color: string;
}

interface TokenRank {
  trophy: number;
  crown: string;
  users: number;
  clock: number;
  coins: string;
}

interface Token {
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

const mockTokens: Token[] = [
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
      { icon: "shield", value: "DS", color: "text-dodger-blue" },
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
      { icon: "shield", value: "DS", color: "text-dodger-blue" },
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
      { icon: "shield", value: "DS", color: "text-dodger-blue" },
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
      { icon: "shield", value: "DS", color: "text-dodger-blue" },
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
      { icon: "shield", value: "DS", color: "text-dodger-blue" },
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
      { icon: "shield", value: "DS", color: "text-dodger-blue" },
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

interface TokenBadgesProps {
  badges: Badge[];
}

function TokenBadges({ badges }: TokenBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
      {badges.map((badge) => {
        const Icon = BADGE_ICONS[badge.icon];
        return (
          <span
            key={badge.icon + badge.value}
            className="flex items-center gap-1 rounded-md bg-surface-1 px-1.5 py-0.5 text-b-5"
          >
            <Icon className={cn("size-3", badge.color)} />
            <span className={badge.color}>{badge.value}</span>
          </span>
        );
      })}
    </div>
  );
}

interface TokenRowProps {
  token: Token;
}

function TokenRow({ token }: TokenRowProps) {
  const priceIsUp = !token.priceChange.startsWith("-");

  return (
    <div className="flex items-center gap-6 border-b border-border px-4 py-3 transition-colors hover:bg-surface-1/60">
      {/* Token identity */}
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="relative shrink-0">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-xl text-2xl",
              token.avatarBg,
            )}
          >
            {token.emoji}
          </div>
          <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-surface-3 ring-2 ring-background">
            <BadgeCheck className="size-3 text-dodger-blue" />
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 text-b-3">
            <span className="font-semibold text-foreground">{token.name}</span>
            <span className="truncate text-muted-foreground">{token.sub}</span>
            <Pencil className="size-3 shrink-0 text-muted-foreground" />
            <Users className="size-3 shrink-0 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-1.5 text-b-4 text-muted-foreground">
            <span className="shrink-0">{token.age}</span>
            <span className="text-border">|</span>
            <span className="truncate">{token.address}</span>
            <Copy className="size-3 shrink-0 cursor-pointer hover:text-foreground" />
            <Search className="size-3 shrink-0 cursor-pointer hover:text-foreground" />
          </div>

          <TokenBadges badges={token.badges} />
        </div>
      </div>

      {/* Market data */}
      <div className="flex w-[230px] shrink-0 flex-col items-end gap-1.5 border-l border-border pl-6 text-b-4">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">ATH</span>
          <span className="font-medium text-foreground">{token.ath}</span>
          <span className="text-up">{token.athChange}</span>
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="text-muted-foreground">MC</span>
          <span className="font-medium text-dodger-blue">{token.mc}</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-up/40 to-up"
              style={{ width: `${token.mcProgress}%` }}
            />
          </div>
          <span className="font-semibold text-foreground">{token.price}</span>
          <span className={priceIsUp ? "text-up" : "text-down"}>
            {token.priceChange}
          </span>
        </div>
      </div>

      {/* Activity + buy */}
      <div className="flex w-[280px] shrink-0 flex-col items-end gap-1.5 border-l border-border pl-6 text-b-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{token.age}</span>
          <Button size="sm" className="gap-1">
            <Zap className="size-3.5" />
            Buy
          </Button>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Trophy className="size-3 text-casablanca" />
            {token.rank.trophy}
          </span>
          <span className="flex items-center gap-1">
            <Crown className="size-3 text-casablanca" />
            {token.rank.crown}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3 text-silver" />
            {token.rank.users}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {token.rank.clock}
          </span>
          <span className="flex items-center gap-1">
            <Coins className="size-3 text-ocean-green" />
            {token.rank.coins}
          </span>
          <span>TX {token.txCount}</span>
        </div>

        <div className="w-full border-t border-border pt-1 text-right text-b-5 text-muted-foreground">
          V {token.volume}
        </div>
      </div>
    </div>
  );
}

export default function SurgeTable() {
  return (
    <div className="w-full">
      {mockTokens.map((token) => (
        <TokenRow key={token.id} token={token} />
      ))}
    </div>
  );
}
