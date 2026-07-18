import { BadgeCheck, CalendarDays, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { XIcon } from "@/components/ui/icons";
import { getInitials } from "@/lib/utils";
import type { MemeToken, TrendingToken } from "../../market.token.type";

interface SocialHoverTooltipProps {
  token: TrendingToken | MemeToken;
}

export function SocialHoverTooltip({ token }: SocialHoverTooltipProps) {
  const twitterUrl = token.extensions?.twitter;
  const handle = twitterUrl ? twitterUrl.split("/").pop() : token.symbol;

  // You can derive a join date from `recent_listing_time` if needed,
  // or use a static one to match the screenshot for now.
  const dateStr = "May 2026"; // Hardcoded to match screenshot

  return (
    <div className="flex flex-col">
      {/* Top Banner Section */}
      <div className="relative flex h-28 w-full items-center justify-center bg-linear-to-t from-violet-900 to-violet-600">
        {token.logo_uri && (
          <picture>
            <img
              src={token.logo_uri}
              alt={token.name}
              className="h-16 w-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
            />
          </picture>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Profile Info */}
        <div className="-mt-2/3 relative flex items-start justify-between">
          <Avatar>
            <AvatarImage src={token.logo_uri || ""} />
            <AvatarFallback>{getInitials(token.name)}</AvatarFallback>
          </Avatar>
          <Button
            size="icon-sm"
            variant={"ghost"}
            onClick={() =>
              twitterUrl ? window.open(twitterUrl, "_blank") : undefined
            }
          >
            <ExternalLink />
          </Button>
        </div>

        <div className="-mt-2 flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-lg">{token.name}</span>
            <BadgeCheck className="size-4 fill-blue-500/20 text-blue-500" />
            <XIcon className="size-3.5" />
          </div>
          <span className="text-muted-foreground text-sm">@{handle}</span>
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-sm">
          {token.extensions?.description || "The Prophecy is finally here."}
        </p>

        {/* Joined Date */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <CalendarDays className="size-[18px]" />
          <span>Joined {dateStr}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="font-bold text-white">1</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div>
            <span className="font-bold text-white">105</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>

        {twitterUrl && (
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            See Profile on X
          </a>
        )}
      </div>
    </div>
  );
}
