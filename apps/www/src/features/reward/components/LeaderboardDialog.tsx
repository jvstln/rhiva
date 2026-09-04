"use client";

import type React from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import {
  cn,
  formatCompactNumber,
  formatSignedUsd,
  truncateString,
} from "@/lib/utils";
import { Button, CopyButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { LeaderboardEntry } from "../reward.hook";
import { Observer, useGSAP } from "@/lib/gsap.util";
import { useRef, useState } from "react";

const leaderboardDialogHandle = createDialogHandle();

const HEADERS = [
  "Rank",
  "Wallet",
  "Total Points",
  "Daily Points",
  "Total Profit",
  "Daily Profit",
] as const;

// Shared grid template — applied to the header AND every row so columns stay
// perfectly aligned without a real <table>
const GRID_STYLE: React.CSSProperties = {
  // gridTemplateColumns: "56px minmax(140px, 1.5fr) 100px 95px 105px 95px",
  gridTemplateColumns: "56px repeat(5, 1fr)",
};

const HEADER_STYLE = {
  ...GRID_STYLE,
  backgroundColor: "var(--color-popover, #0a0a0a)",
} satisfies React.CSSProperties;

function ProfitCell({ value }: { value: number }) {
  return (
    <span
      className={cn("tabular-nums", value < 0 ? "text-destructive" : "text-up")}
    >
      {formatSignedUsd(value)}
    </span>
  );
}

function LeaderboardRow({ entry, ...props }: { entry: LeaderboardEntry }) {
  const isCurrentUser = !!entry.isCurrentUser;

  return (
    <div
      // Query hook for the scroll observer below (it needs to find this row)
      data-current-user={isCurrentUser || undefined}
      style={{
        ...GRID_STYLE,
      }}
      className={cn(
        "grid items-center border-border/20 border-b bg-background text-sm text-white transition-colors last:border-b-0 hover:bg-muted",
        // The current user's row is highlighted and sticky. The parent passes
        // data-current-user-position ("top" | "bottom") so the row pins to the
        // top edge once scrolled past, or holds the bottom edge until its
        // natural position scrolls into view.
        isCurrentUser &&
          "sticky border-primary/80 border-y bg-[color-mix(in_oklab,var(--color-primary)_30%,black)] font-medium text-amber-50 shadow-md shadow-primary/30 ring-1 ring-primary-400/60 data-[current-user-position=top]:top-(--header-height) data-[current-user-position=bottom]:bottom-0",
      )}
      {...props}
    >
      <div className="whitespace-nowrap px-3 py-2.5">
        <span className="font-semibold tabular-nums">#{entry.rank}</span>
      </div>
      <div className="whitespace-nowrap px-3 py-2.5 font-mono text-xs">
        <span className="flex items-center gap-2">
          {truncateString(entry.wallet)}
          <CopyButton copy={entry.wallet} />
          {isCurrentUser && (
            <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 font-sans font-semibold text-[10px] text-primary uppercase">
              You
            </span>
          )}
        </span>
      </div>
      <div className="whitespace-nowrap px-3 py-2.5 tabular-nums">
        {formatCompactNumber(entry.totalPoints)}
      </div>
      <div className="whitespace-nowrap px-3 py-2.5 text-muted-foreground tabular-nums">
        {formatCompactNumber(entry.dailyPoints)}
      </div>
      <div className="whitespace-nowrap px-3 py-2.5">
        <ProfitCell value={entry.totalProfit} />
      </div>
      <div className="whitespace-nowrap px-3 py-2.5">
        <ProfitCell value={entry.dailyProfit} />
      </div>
    </div>
  );
}

type LeaderboardDialogProps = Dialog.Props & {
  children?: React.ReactElement;
  leaderboard: UseQueryResult<LeaderboardEntry[]>;
};

export const LeaderboardDialog = ({
  children = (
    <Button variant="outline">
      <Trophy />
      Leaderboard
    </Button>
  ),
  leaderboard,
  ...props
}: LeaderboardDialogProps) => {
  const { data, isLoading } = leaderboard;
  const entries = data ?? [];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [currentUserPosition, setCurrentUserPosition] = useState<
    "top" | "bottom"
  >("top");

  // Tracks whether the current user's row sits below the visible viewport.
  // "bottom" → the row sticks to the container's bottom edge until the user
  // scrolls down to it; "top" → the row scrolls normally and pins under the
  // header once scrolled past. Drives the data-current-user-position variant
  // on LeaderboardRow.
  useGSAP(
    () => {
      const handleCurrentUserPosition = () => {
        // +5px tolerance so a row resting exactly on the edge counts as "in view"
        const isCurrentUserAtBottom =
          (document
            .querySelector("[data-current-user]")
            ?.getBoundingClientRect().bottom ?? Infinity) +
            5 >=
          (scrollContainerRef.current?.getBoundingClientRect().bottom ??
            -Infinity);

        setCurrentUserPosition(isCurrentUserAtBottom ? "bottom" : "top");
      };

      Observer.create({
        target: scrollContainerRef.current,
        onUp: handleCurrentUserPosition,
        onDown: handleCurrentUserPosition,
      });

      handleCurrentUserPosition();
    },
    { scope: scrollContainerRef },
  );

  return (
    <Dialog
      {...props}
      handle={leaderboardDialogHandle}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent className="flex h-[85vh] min-h-[600px] flex-col overflow-hidden sm:w-[80vw] sm:min-w-2xl sm:max-w-auto">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription>
            Top traders ranked by total points
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col py-2">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : entries.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-border/20 bg-muted/20 text-muted-foreground text-sm">
              No data available
            </div>
          ) : (
            <ScrollArea
              ref={scrollContainerRef}
              // --header-height feeds both the sticky header height and the
              // sticky offset of the current user's row (top-(--header-height))
              className="flex h-full min-h-0 min-h-0 flex-1 flex-1 flex-col overflow-hidden rounded-lg border border-border/40 bg-background [--header-height:54px]"
              showIndicator
            >
              <div className="min-w-[580px]">
                <div
                  style={HEADER_STYLE}
                  className="sticky top-0 z-20 grid h-(--header-height) items-center border-border/40 border-b bg-popover font-semibold text-muted-foreground text-xs capitalize tracking-wider"
                >
                  {HEADERS.map((header) => (
                    <div
                      key={header}
                      className="px-3 py-2.5"
                    >
                      {header}
                    </div>
                  ))}
                </div>

                <div className="bg-background">
                  {entries.map((entry) => (
                    <LeaderboardRow
                      key={entry.rank}
                      entry={entry}
                      data-current-user-position={
                        entry.isCurrentUser ? currentUserPosition : undefined
                      }
                    />
                  ))}
                </div>
              </div>
              <ScrollBar
                orientation="vertical"
                showScrollBar
              />
              <ScrollBar
                orientation="horizontal"
                showScrollBar
              />
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
