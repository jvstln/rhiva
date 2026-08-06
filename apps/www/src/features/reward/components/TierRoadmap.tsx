import { mockRewardAccount } from "@/components/ui/data/reward-data";
import { cn } from "@/lib";
import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles, Trophy } from "lucide-react";
import Image from "next/image";
import { REWARD_TIERS, type RewardTier } from "@/features/reward/reward.schema";
import { useRewardProfile } from "@/features/reward/reward.hook";
import { QueryState } from "@/components/layout/QueryState";

export function TierBadge({
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
        className={cn("object-contain", locked && "opacity-70 grayscale")}
      />
    </div>
  );
}

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
      <TierBadge
        tier={tier}
        locked={!unlocked}
        size={100}
      />
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

export function TierRoadmap() {
  const visibleTiers = REWARD_TIERS.slice(0, 5);
  const rewardProfile = useRewardProfile();

  return (
    <div className="space-y-7 rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium text-foreground text-lg">Tier Roadmap</h2>
          <p className="text-muted-foreground text-sm">
            Progress through the ranks and unlock exclusive badges
          </p>
        </div>
        <TierRoadmapDialog>
          <Button
            size="sm"
            variant="outline"
          >
            View All Tiers
          </Button>
        </TierRoadmapDialog>
      </div>

      <QueryState query={rewardProfile}>
        {(rewardProfile) => (
          <ScrollArea>
            <div className="relative flex items-start">
              {visibleTiers.map((tier, index) => {
                const unlocked = rewardProfile.data.xp >= tier.minXp;
                return (
                  <RoadmapStep
                    key={tier.name}
                    tier={tier}
                    unlocked={unlocked}
                    isLast={index === visibleTiers.length - 1}
                    index={index}
                  />
                );
              })}
              {/* connecting line, sits behind the badges */}
              <div className="absolute top-12.5 right-[10%] left-[10%] -z-10 h-px bg-white/10" />
            </div>
            <ScrollBar
              orientation="horizontal"
              showIndicator
            />
          </ScrollArea>
        )}
      </QueryState>

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
  children,
  ...props
}: Dialog.Props & { children?: React.ReactElement }) {
  const rewardProfile = useRewardProfile();

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tier Roadmap</DialogTitle>
          <DialogDescription>
            Progress through the ranks and unlock exclusive badges
          </DialogDescription>
        </DialogHeader>

        <QueryState query={rewardProfile}>
          {(rewardProfile) => (
            <div className="grid grid-cols-5 gap-x-4 gap-y-8">
              {REWARD_TIERS.map((tier) => {
                const unlocked = rewardProfile.data.xp >= tier.minXp;
                return (
                  <div
                    key={tier.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <TierBadge
                      tier={tier}
                      locked={!unlocked}
                      size={84}
                    />
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
          )}
        </QueryState>
      </DialogContent>
    </Dialog>
  );
}
