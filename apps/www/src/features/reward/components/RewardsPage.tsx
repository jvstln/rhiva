"use client";

import {
  Coins,
  Globe,
  LineChart,
  Repeat,
  Share2,
  Star,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCompactNumber } from "@/lib/utils";
import { TierExportDialog } from "./TierExportDialog";
import { ClaimRewardsDialog } from "./ClaimRewardsDialog";
import { CopyButton } from "@/components/ui/button/copy-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
} from "@/components/layout/DashboardUi";
import {
  TierBadge,
  TierRoadmap,
} from "@/features/reward/components/TierRoadmap";
import { REWARD_TIERS } from "@/features/reward/reward.schema";
import { useRewardProfile } from "@/features/reward/reward.hook";
import { QueryState } from "@/components/layout/QueryState";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Current tier card                                                    */
/* ------------------------------------------------------------------ */

function CurrentTierCard() {
  const rewardProfile = useRewardProfile();

  return (
    <QueryState query={rewardProfile}>
      {(rewardProfile) => {
        const currentTier = REWARD_TIERS[rewardProfile.data.tier];
        const nextTier = REWARD_TIERS[rewardProfile.data.tier + 1];

        return (
          <div
            className="relative overflow-hidden rounded-lg bg-surface-1 p-6"
            style={{
              boxShadow: `inset 1px 1px 0 rgba(255, 255, 255, 0.6)`,
            }}
          >
            <div className="pointer-events-none absolute top-0 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/30 blur-[100px]" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="flex shrink-0 flex-col items-center gap-1">
                <TierBadge
                  tier={currentTier}
                  locked={false}
                  size={110}
                />
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
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Share2 />
                      Share
                    </Button>
                  </TierExportDialog>
                </div>

                <p className="font-medium text-foreground/90 text-xl">
                  {formatCompactNumber(rewardProfile.data.xp)} of{" "}
                  {formatCompactNumber(nextTier.minXp ?? currentTier.minXp)} XP
                </p>

                <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${rewardProfile.data.xp / nextTier.minXp}%`,
                    }}
                  />
                </div>

                <p className="text-muted-foreground text-sm">
                  {nextTier
                    ? `You're almost there! Trade ${nextTier.minXp - rewardProfile.data.xp} SOL to reach ${nextTier.name}`
                    : "You've reached the highest tier!"}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    </QueryState>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card row                                                        */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  description,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-lg border p-4",
        className,
      )}
      style={{
        boxShadow: `inset 1px -1px 0 rgba(255, 255, 255, 0.6)`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 p-1 text-accent">
          {icon}
        </span>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="font-semibold text-foreground text-lg">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier roadmap (inline, first 5 tiers) + dialog (all 10 tiers)         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Referral card                                                        */

/* ------------------------------------------------------------------ */

function ReferralCard() {
  const rewardProfile = useRewardProfile();
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  return (
    <div
      className="relative overflow-hidden rounded-lg border p-6"
      style={{
        boxShadow: `0 4px 32px rgba(255, 255, 255, 0.08), inset -1px -1px 0 rgba(255, 255, 255, 0.6)`,
      }}
    >
      <div className="pointer-events-none absolute top-0 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 blur-[120px]" />

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
          {rewardProfile.data ? (
            <InputGroup>
              <InputGroupInput
                readOnly
                value={`${origin}?referralCode=${rewardProfile.data.refererCode}`}
              />
              <InputGroupAddon align={"inline-end"}>
                <CopyButton
                  size="icon-lg"
                  copy={`${origin}?referralCode=${rewardProfile.data.refererCode}`}
                />
              </InputGroupAddon>
            </InputGroup>
          ) : (
            <Skeleton className="h-12 w-full" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 rounded-2xl border bg-foreground/3 p-4">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-up/10">
                <Repeat className="size-3.5 text-up" />
              </span>
            </div>
            <p className="text-muted-foreground">Total Invited</p>
            <p className="mt-auto font-medium text-2xl text-foreground">
              {formatCompactNumber(rewardProfile.data?.invites)}
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
              {formatCompactNumber(rewardProfile.data?.earnedNative)} SOL
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
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transition-all"
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

/* ------------------------------------------------------------------ */
/* Page                                                                 */

/* ------------------------------------------------------------------ */

export function RewardsPage() {
  const rewardProfile = useRewardProfile();

  return (
    <DashboardSlot>
      <div className="flex justify-between">
        <div>
          <DashboardHeader>Point System</DashboardHeader>
          <DashboardDescription>
            Track your XP, level up, and climb the global ranks
          </DashboardDescription>
        </div>
        <ClaimRewardsDialog />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <CurrentTierCard />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Globe />}
              className="[--accent:var(--color-primary)]"
              label="Global Rank"
              value={`#${formatCompactNumber(rewardProfile.data?.rank)}`}
              description={`Total users: ${formatCompactNumber(rewardProfile.data?.users)}`}
            />
            <StatCard
              icon={<Star />}
              className="[--accent:var(--color-casablanca)]"
              label="Total Stars"
              value={formatCompactNumber(rewardProfile.data?.stars)}
              description="Keep Collecting!"
            />
            <StatCard
              icon={<Zap />}
              className="[--accent:var(--color-info)]"
              label="Total XP"
              value={formatCompactNumber(rewardProfile.data?.xp)}
              description={`${formatCompactNumber(rewardProfile.data?.averageXpPerDay, { withSign: true })} XP per day`}
            />
          </div>

          <TierRoadmap />
        </div>
        <div className="flex flex-col gap-6">
          <ReferralCard />

          {/* Quests */}
          <div className="flex grow flex-col space-y-8 rounded-lg border border-border p-6">
            <p className="font-medium text-foreground">Quests</p>
            <div className="flex flex-1 items-center justify-center gap-16">
              <QuestRing
                label={"5 transactions per day = 150XP bonus"}
                rewardXp={150}
                progressPercent={
                  (rewardProfile.data?.todayTransactions || 0) / 5
                }
                icon={"volume"}
              />
              <QuestRing
                label={"Transaction volume is $500 = 500XPs"}
                rewardXp={500}
                progressPercent={
                  (rewardProfile.data?.todayVolumeUsd || 0) / 500
                }
                icon={"transactions"}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardSlot>
  );
}
