"use client";

import {
  Coins,
  Globe,
  LineChart,
  Repeat,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import type * as React from "react";
import { useMemo, useState } from "react";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
} from "@/components/layout/DashboardUi";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  mockRewardAccount,
  REWARD_TIERS,
  type RewardTier,
} from "@/data/reward-data";
import { cn, formatCompactNumber } from "@/lib/utils";
import { TierExportDialog } from "./TierExportDialog";

export type RewardQuest = {
  id: string;
  label: string;
  rewardXp: number;
  progressPercent: number;
  icon: "volume" | "transactions";
};

export const REWARD_QUESTS: RewardQuest[] = [
  {
    id: "volume",
    label: "5 transactions per day = 150XP bonus",
    rewardXp: 1_000,
    progressPercent: 62,
    icon: "volume",
  },
  {
    id: "transactions",
    label: "Transaction volume is $500 = 500XP",
    rewardXp: 200,
    progressPercent: 38,
    icon: "transactions",
  },
];

/* ------------------------------------------------------------------ */
/* Tier progress helper                                                 */
/* ------------------------------------------------------------------ */

function getTierProgress(tiers: RewardTier[], currentXp: number) {
  const currentIndex = [...tiers]
    .reverse()
    .findIndex((tier) => currentXp >= tier.minXp);
  const resolvedIndex = tiers.length - 1 - currentIndex;

  const currentTier = tiers[resolvedIndex];
  const nextTier = tiers[resolvedIndex + 1];

  const progressPercent = nextTier
    ? Math.min(
        100,
        ((currentXp - currentTier.minXp) /
          (nextTier.minXp - currentTier.minXp)) *
          100,
      )
    : 100;

  return { currentTier, nextTier, progressPercent };
}

/* ------------------------------------------------------------------ */
/* Tier badge (dummy SVG-ish placeholder — swap for real art later)     */
/* ------------------------------------------------------------------ */

function TierBadge({
  tier,
  locked,
  size = 100,
}: {
  tier: RewardTier;
  locked: boolean;
  size?: number;
}) {
  return (
    <div
      className="relative flex size-full items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Image
        src={tier.image}
        alt={tier.name}
        fill
        // sizes={`${size * 0.55}px`}
        className={cn("object-contain", locked && "opacity-70 grayscale")}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Current tier card                                                    */
/* ------------------------------------------------------------------ */

function CurrentTierCard() {
  const { currentTier, nextTier, progressPercent } = useMemo(
    () => getTierProgress(REWARD_TIERS, mockRewardAccount.currentXp),
    [],
  );

  const xpToNext = nextTier
    ? Math.max(0, nextTier.minXp - mockRewardAccount.currentXp)
    : 0;

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-surface-1 p-6"
      style={{
        boxShadow: `inset 1px 1px 0 rgba(255, 255, 255, 0.6)`,
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-0 left-1/2 size-32 rounded-full bg-foreground/30 blur-[100px]" />

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <TierBadge tier={currentTier} locked={false} size={110} />
          <span className="text-foreground/80 text-lg">1x</span>
          <span className="text-muted-foreground/60 text-sm">
            10% Referral Rate
          </span>
        </div>

        <div className="w-full flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Next Tier:{" "}
              <span className="font-semibold text-foreground">
                {nextTier?.name ?? "MAX"}
              </span>
            </p>

            <TierExportDialog tier={currentTier}>
              <Button size="sm" variant="outline">
                <Share2 />
                Share
              </Button>
            </TierExportDialog>
          </div>

          <p className="font-medium text-foreground/90 text-xl">
            {formatCompactNumber(mockRewardAccount.currentXp)} of{" "}
            {formatCompactNumber(nextTier?.minXp ?? currentTier.minXp)} XP
          </p>

          <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-muted-foreground text-sm">
            {nextTier
              ? `You're almost there! Trade ${xpToNext} SOL to reach ${nextTier.name}`
              : "You've reached the highest tier!"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card row                                                        */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  iconClassName,
  iconBgClassName,
  label,
  value,
  helper,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  iconBgClassName: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-lg border p-4"
      style={{
        boxShadow: `inset 1px -1px 0 rgba(255, 255, 255, 0.6)`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full",
            iconBgClassName,
          )}
        >
          <Icon className={cn("size-3.5", iconClassName)} />
        </span>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="font-semibold text-foreground text-lg">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground text-sm">{helper}</p>
    </div>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        icon={Globe}
        iconClassName="text-primary"
        iconBgClassName="bg-primary/10"
        label="Global Rank"
        value={`#${formatCompactNumber(mockRewardAccount.globalRank)}`}
        helper={`Total users: ${mockRewardAccount.totalUsers.toLocaleString()}`}
      />
      <StatCard
        icon={Star}
        iconClassName="text-casablanca"
        iconBgClassName="bg-casablanca/10"
        label="Total Stars"
        value={String(mockRewardAccount.totalStars)}
        helper="Keep Collecting!"
      />
      <StatCard
        icon={Zap}
        iconClassName="text-info"
        iconBgClassName="bg-info/10"
        label="Total XP"
        value={mockRewardAccount.currentXp.toLocaleString()}
        helper={`+${mockRewardAccount.xpPerDay} XP per day`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier roadmap (inline, first 5 tiers) + dialog (all 10 tiers)         */
/* ------------------------------------------------------------------ */

function RoadmapStep({
  tier,
  unlocked,
  index,
}: {
  tier: RewardTier;
  unlocked: boolean;
  isLast: boolean;
  index: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2",
        index === 3 && "hidden sm:flex",
        index === 4 && "hidden md:flex",
      )}
    >
      <TierBadge tier={tier} locked={!unlocked} size={100} />
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={cn(
            "font-medium text-lg",
            unlocked ? "text-primary" : "text-muted-foreground",
          )}
        >
          {tier.name}
        </span>
        <span
          className={cn(
            "text-lg",
            unlocked ? "text-foreground/80" : "text-muted-foreground/40",
          )}
        >
          {tier.multiplier}
        </span>
      </div>
    </div>
  );
}

function TierRoadmapCard({ onViewAll }: { onViewAll: () => void }) {
  const visibleTiers = REWARD_TIERS.slice(0, 5);

  return (
    <div className="space-y-7 rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground text-lg">Tier Roadmap</p>
          <p className="text-muted-foreground text-sm">
            Progress through the ranks and unlock exclusive badges
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onViewAll}>
          View All Tiers
        </Button>
      </div>

      <ScrollArea>
        <div className="relative flex items-start">
          {visibleTiers.map((tier, index) => {
            const unlocked = mockRewardAccount.currentXp >= tier.minXp;
            return (
              <RoadmapStep
                key={tier.id}
                tier={tier}
                unlocked={unlocked}
                isLast={index === visibleTiers.length - 1}
                index={index}
              />
            );
          })}
          {/* connecting line, sits behind the badges */}
          <div className="-z-10 absolute top-[50px] right-[10%] left-[10%] h-px bg-white/10" />
        </div>
        <ScrollBar orientation="horizontal" showIndicator />
      </ScrollArea>

      <div className="flex items-center gap-3 rounded-lg bg-primary/4 p-4">
        <Trophy className="size-9 shrink-0 text-casablanca" />
        <div>
          <p className="font-semibold text-foreground/80 text-sm">
            Climb the ranks, earn more XP, and unlock exclusive rewards!
          </p>
          <p className="text-muted-foreground/60 text-xs">
            The more you engage, the higher you go.
          </p>
        </div>
        <Sparkles className="ml-auto size-4 shrink-0 text-casablanca" />
      </div>
    </div>
  );
}

function TierRoadmapDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tier Roadmap</DialogTitle>
          <DialogDescription>
            Progress through the ranks and unlock exclusive badges
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-x-4 gap-y-8">
          {REWARD_TIERS.map((tier) => {
            const unlocked = mockRewardAccount.currentXp >= tier.minXp;
            return (
              <div key={tier.id} className="flex flex-col items-center gap-2">
                <TierBadge tier={tier} locked={!unlocked} size={84} />
                <span
                  className={cn(
                    "font-medium text-sm",
                    unlocked ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {tier.name}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    unlocked
                      ? "text-foreground/80"
                      : "text-muted-foreground/40",
                  )}
                >
                  {tier.multiplier}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Referral card                                                        */
/* ------------------------------------------------------------------ */

function ReferralCard() {
  const [_copied, setCopied] = useState(false);

  const _handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockRewardAccount.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied — no-op for this mock
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg border p-6"
      style={{
        boxShadow: `0 4px 32px rgba(255, 255, 255, 0.08), inset -1px -1px 0 rgba(255, 255, 255, 0.6)`,
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-0 left-1/2 size-56 rounded-full bg-foreground/20 blur-[120px]" />

      <div className="relative space-y-6">
        <div>
          <p className="font-medium text-foreground text-lg">Referral</p>
          <p className="text-muted-foreground text-sm">
            Share your access code with your friends and earn 10% of their fees.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-foreground text-sm">
            Your Referral Link
          </p>
          <InputGroup>
            <InputGroupInput readOnly value={mockRewardAccount.referralLink} />
            <InputGroupAddon align={"inline-end"}>
              <CopyButton
                size="icon-lg"
                copy={mockRewardAccount.referralLink}
              />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 rounded-2xl border bg-foreground/3 p-4">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-up/10">
                <Repeat className="size-3.5 text-up" />
              </span>
            </div>
            <p className="text-muted-foreground">Total Invited</p>
            <p className="mt-auto font-medium text-2xl text-foreground">
              {mockRewardAccount.totalInvited}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border bg-foreground/3 p-4">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-casablanca/10">
                <Coins className="size-3.5 text-casablanca" />
              </span>
            </div>
            <p className="text-muted-foreground">Total Earnings</p>
            <p className="mt-auto font-medium text-2xl text-foreground">
              {mockRewardAccount.totalEarnings} SOL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quests card                                                          */
/* ------------------------------------------------------------------ */

function RadialProgress({
  progressPercent,
  size = 122,
  strokeWidth = 8,
  className,
  children,
}: {
  progressPercent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progressPercent / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="presentation"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="white"
          opacity={0.1}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={className}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        {children}
      </div>
    </div>
  );
}

function QuestRing({
  label,
  rewardXp,
  progressPercent,
  icon,
}: {
  label: string;
  rewardXp: number;
  progressPercent: number;
  icon: "volume" | "transactions";
}) {
  const Icon = icon === "volume" ? LineChart : Repeat;
  const colorClassName = icon === "volume" ? "text-primary" : "text-sell";

  return (
    <div className="flex flex-col items-center gap-3">
      <RadialProgress
        progressPercent={progressPercent}
        className={colorClassName}
      >
        <Icon className={cn("size-5", colorClassName)} />
        <span className="font-semibold text-foreground text-sm">
          +{rewardXp.toLocaleString()}
        </span>
      </RadialProgress>
      <p className="max-w-[160px] text-center text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
}

function QuestsCard() {
  return (
    <div className="flex grow flex-col space-y-8 rounded-lg border border-border p-6">
      <p className="font-medium text-foreground">Quests</p>
      <div className="flex flex-1 items-center justify-center gap-16">
        {REWARD_QUESTS.map((quest) => (
          <QuestRing
            key={quest.id}
            label={quest.label}
            rewardXp={quest.rewardXp}
            progressPercent={quest.progressPercent}
            icon={quest.icon}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export function RewardsPage() {
  const [tierDialogOpen, setTierDialogOpen] = useState(false);

  return (
    <DashboardSlot>
      <div>
        <DashboardHeader>Point System</DashboardHeader>
        <DashboardDescription>
          Track your XP, level up, and climb the global ranks
        </DashboardDescription>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <CurrentTierCard />
          <StatsRow />
          <TierRoadmapCard onViewAll={() => setTierDialogOpen(true)} />
        </div>

        <div className="flex flex-col gap-6">
          <ReferralCard />
          <QuestsCard />
        </div>
      </div>

      <TierRoadmapDialog
        open={tierDialogOpen}
        onOpenChange={setTierDialogOpen}
      />
    </DashboardSlot>
  );
}
