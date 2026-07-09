"use client";

import { Dna, Flame, Globe, Zap } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { mockPumpLiveStreams } from "@/data/pump-live-data";
import { arrayWithId, cn, formatCompactCurrency } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export interface PumpLiveStream {
  id: string;
  thumbnailUrl: string;
  isLive: boolean;
  channelName: string;
  channelAvatarEmoji: string;
  channelAvatarColor: string;
  marketCap: number;
  reactions: string[];
  hasAudit: boolean;
  isHot: boolean;
  hasWebsite: boolean;
}

/* ------------------------------------------------------------------ */
/* Data fetching / Mock provider                                       */
/* ------------------------------------------------------------------ */

export function useLivePumpStreams() {
  return {
    data: mockPumpLiveStreams as PumpLiveStream[],
    isLoading: false,
  };
}

/* ------------------------------------------------------------------ */
/* LIVE badge                                                           */
/* ------------------------------------------------------------------ */

function LiveBadge() {
  return (
    <span className="absolute top-2 left-2 rounded-md bg-primary px-1.5 py-0.5 font-semibold text-b-5 text-primary-foreground">
      LIVE
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Stream thumbnail                                                     */
/* ------------------------------------------------------------------ */

function StreamThumbnail({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-2">
      {/* biome-ignore lint: plain img keeps this independent of next/image remote-pattern config */}
      <img
        src={stream.thumbnailUrl}
        alt={stream.channelName}
        className="size-full object-cover"
      />
      {stream.isLive && <LiveBadge />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Channel row (avatar, name, market cap)                              */
/* ------------------------------------------------------------------ */

function ChannelRow({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs"
          style={{ backgroundColor: stream.channelAvatarColor }}
        >
          {stream.channelAvatarEmoji}
        </span>
        <span className="truncate text-b-4 text-muted-foreground">
          {stream.channelName}
        </span>
      </div>
      <span className="shrink-0 font-semibold text-b-4 text-up">
        {formatCompactCurrency(stream.marketCap)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reaction row                                                         */
/* ------------------------------------------------------------------ */

function ReactionRow({ reactions }: { reactions: string[] }) {
  if (reactions.length === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-1 text-b-3 leading-none">
      {reactions.map((emoji, index) => (
        // biome-ignore lint: emoji reactions have no stable id in mock data
        <span key={index}>{emoji}</span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status icon (audit / hot / website)                                  */
/* ------------------------------------------------------------------ */

interface StatusIconProps {
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  activeClassName: string;
  label: string;
}

function StatusIcon({
  icon: Icon,
  active,
  activeClassName,
  label,
}: StatusIconProps) {
  return (
    <span
      className={cn(
        "flex size-5 items-center justify-center",
        active ? activeClassName : "text-muted-foreground/30",
      )}
    >
      <Icon className="size-full" aria-label={label} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Actions row (status icons + buy button)                              */
/* ------------------------------------------------------------------ */

function StreamActionsRow({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <StatusIcon
          icon={Dna}
          active={stream.hasAudit}
          activeClassName="text-ocean-green"
          label="Contract audited"
        />
        <StatusIcon
          icon={Flame}
          active={stream.isHot}
          activeClassName="text-warning"
          label="Trending"
        />
        <StatusIcon
          icon={Globe}
          active={stream.hasWebsite}
          activeClassName="text-silver"
          label="Website"
        />
      </div>

      <Button variant="secondary" size="sm" className="gap-1">
        <Zap className="size-3.5 text-primary" fill="currentColor" />
        Buy
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

function PumpLiveCard({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="flex flex-col">
      <StreamThumbnail stream={stream} />
      <ChannelRow stream={stream} />
      <ReactionRow reactions={stream.reactions} />
      <StreamActionsRow stream={stream} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loading skeleton card                                                */
/* ------------------------------------------------------------------ */

function PumpLiveCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-video w-full animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-3 h-8 w-full animate-pulse rounded bg-surface-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grid shell                                                           */
/* ------------------------------------------------------------------ */

export function PumpLiveGrid({ className }: { className?: string }) {
  const { data, isLoading } = useLivePumpStreams();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-8 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {isLoading &&
        arrayWithId(10).map(({ id }) => <PumpLiveCardSkeleton key={id} />)}

      {!isLoading &&
        data.map((stream) => <PumpLiveCard key={stream.id} stream={stream} />)}

      {!isLoading && data.length === 0 && (
        <p className="col-span-full py-12 text-center text-b-3 text-muted-foreground">
          No live streams right now.
        </p>
      )}
    </div>
  );
}
