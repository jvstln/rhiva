import {
  BadgeCheck,
  Clock,
  Coins,
  Copy,
  Crown,
  Pencil,
  Search,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BADGE_ICONS,
  type Badge,
  mockTokens,
  type Token,
} from "@/data/market-surge-data";
import { cn } from "@/lib/utils";

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
    <div className="flex items-center gap-6 border-border border-b px-4 py-3 transition-colors hover:bg-surface-1/60">
      {/* Token identity */}
      <div className="flex min-w-0 flex-1 basis-1/4 gap-3">
        <div className="relative shrink-0">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-xl text-2xl",
              token.avatarBg,
            )}
          >
            {token.emoji}
          </div>
          <span className="-right-1 -bottom-1 absolute flex size-4 items-center justify-center rounded-full bg-surface-3 ring-2 ring-background">
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

      <Separator orientation="vertical" />

      {/* Market data */}
      <div className="flex min-w-0 flex-1 basis-2/4 flex-col items-end justify-center gap-1.5 text-b-4">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">ATH</span>
          <span className="font-medium text-foreground">{token.ath}</span>
          <span className="text-up">{token.athChange}</span>
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="text-muted-foreground">MC</span>
          <span className="font-medium text-dodger-blue">{token.mc}</span>
          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, var(--color-up))`,
            }}
          />
          <span className="font-semibold text-foreground">{token.price}</span>
          <span className={priceIsUp ? "text-up" : "text-down"}>
            {token.priceChange}
          </span>
        </div>
      </div>

      <Separator orientation="vertical" />

      {/* Activity + buy */}
      <div className="flex w-[280px] shrink-0 basis-1/5 flex-col items-end gap-1.5 text-b-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{token.age}</span>
          <Button size="sm" className="gap-1">
            <Zap className="size-3.5" />
            Buy
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
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

        <div className="w-full border-border border-t pt-1 text-right text-b-5 text-muted-foreground">
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
