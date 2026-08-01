"use client";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

import { Pill } from "lucide-react";
import { Flame, Globe, Zap } from "lucide-react";
import { Clock, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InfoBadge } from "@/components/ui/info-badge";
import { arrayWithId, cn, formatCompactCurrency } from "@/lib/utils";
import { mockPumpLiveStreams } from "@/components/ui/data/pump-live-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PumpLiveStream {
  id: string;
  thumbnailUrl: string;
  isLive: boolean;
  channelName: string;
  channelAvatarEmoji: string;
  channelAvatarColor: string;
  channelAvatarUrl?: string;
  marketCap: number;
  reactions: string[];
  description?: string;
  commentsCount?: number;
  timeAgo?: string;
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
    <span className="absolute bottom-2 left-2 rounded bg-up px-1.5 py-0.5 font-bold text-[10px] text-black">
      LIVE
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Stream thumbnail                                                     */
/* ------------------------------------------------------------------ */

function StreamThumbnail({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-surface-2">
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
    <div className="mt-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar className="size-7">
          <AvatarImage src={stream.channelAvatarUrl ?? ""} />
          <AvatarFallback
            style={{ backgroundColor: stream.channelAvatarColor }}
            className="flex items-center justify-center text-xs"
          >
            {stream.channelAvatarEmoji}
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-bold text-b-3 text-white">
          {stream.channelName}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-b-4 text-gray">MC</span>
        <span className="font-bold text-b-3 text-up">
          {formatCompactCurrency(stream.marketCap)}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Description row                                                      */
/* ------------------------------------------------------------------ */

function DescriptionRow({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="mt-2.5 line-clamp-2 text-b-4 text-gray">
      {stream.description || `${stream.channelName} - Live Stream on Pump!`}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats row                                                            */
/* ------------------------------------------------------------------ */

function StatsRow({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="mt-2.5 flex items-center gap-3 text-b-4 text-gray">
      <span className="flex items-center gap-1.5">
        <MessageCircle className="size-3.5" />
        {stream.commentsCount ?? 0}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5" />
        {stream.timeAgo ?? "1 h ago"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status icon (audit / hot / website)                                  */
/* ------------------------------------------------------------------ */

// StatusIcon logic replaced with InfoBadge variant="icon"

/* ------------------------------------------------------------------ */
/* Actions row (status icons + buy button)                              */
/* ------------------------------------------------------------------ */

function StreamActionsRow({ stream }: { stream: PumpLiveStream }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        <InfoBadge
          tone={stream.hasAudit ? "up" : undefined}
          aria-label="Contract audited"
        >
          <Pill />
        </InfoBadge>
        <InfoBadge
          tone={stream.isHot ? "down" : undefined}
          aria-label="Trending"
        >
          <Flame />
        </InfoBadge>
        <InfoBadge
          tone={!stream.hasWebsite ? "muted" : undefined}
          aria-label="Website"
        >
          <Globe />
        </InfoBadge>
      </div>

      <Button
        size="sm"
        className="h-7 gap-1.5 rounded-full bg-surface-2 px-3 text-up hover:bg-surface-3 hover:text-up"
      >
        <Zap
          className="size-3 text-up"
          fill="currentColor"
        />
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
      <DescriptionRow stream={stream} />
      <StatsRow stream={stream} />
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
      <div className="aspect-4/3 w-full animate-pulse rounded-xl bg-surface-2" />
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="size-7 animate-pulse rounded-full bg-surface-2" />
          <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
        </div>
        <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
      </div>
      <div className="mt-2.5 h-8 w-full animate-pulse rounded bg-surface-2" />
      <div className="mt-2.5 flex gap-3">
        <div className="h-3 w-8 animate-pulse rounded bg-surface-2" />
        <div className="h-3 w-12 animate-pulse rounded bg-surface-2" />
      </div>
      <div className="mt-3 h-7 w-full animate-pulse rounded bg-surface-2" />
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
        data.map((stream) => (
          <PumpLiveCard
            key={stream.id}
            stream={stream}
          />
        ))}

      {!isLoading && data.length === 0 && (
        <p className="col-span-full py-12 text-center text-b-3 text-muted-foreground">
          No live streams right now.
        </p>
      )}
    </div>
  );
}
