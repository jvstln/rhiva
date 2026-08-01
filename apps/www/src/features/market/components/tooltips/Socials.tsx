import type { TokenDetail } from "@rhivadotfun/dataapi";
import { siGoogle, siTiktok, siX, siYoutube } from "simple-icons";
import {
  Eye,
  User,
  Globe,
  Search,
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import { getInitials } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { LeafIcon, SimpleIcon, XIcon } from "@/components/ui/icons";
import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SocialHoverTooltipProps {
  token: TokenDetail;
}

export function TokenLatestPost({ token }: SocialHoverTooltipProps) {
  return (
    <InfoBadge
      aria-label={"Token latest post"}
      className="[--accent:var(--color-info)]"
      tooltip={
        <div className="flex flex-col">
          {/* Top Banner Section */}
          <div className="relative flex h-28 w-full items-center justify-center bg-linear-to-t from-violet-900 to-violet-600">
            {token.logo_uri && (
              <picture>
                <img
                  src={token.logo_uri}
                  alt={token.name ?? "Token"}
                  className="h-16 w-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                />
              </picture>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Profile Info */}
            <div className="relative -mt-2/3 flex items-start justify-between">
              <Avatar>
                <AvatarImage src={token.logo_uri || ""} />
                <AvatarFallback>
                  {token.name ? getInitials(token.name) : <User />}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon-sm"
                variant={"ghost"}
                onClick={() =>
                  token.social?.twitter_url
                    ? window.open(token.social.twitter_url, "_blank")
                    : undefined
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
              <span className="text-muted-foreground text-sm">
                {token.social?.twitter_handle
                  ? `@${token.social.twitter_handle}`
                  : "N/A"}
              </span>
            </div>

            {/* Bio */}
            <p className="text-muted-foreground text-sm">
              {token.social?.twitter_handle
                ? `@${token.social.twitter_handle}`
                : "N/A"}
            </p>

            {/* Joined Date */}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <CalendarDays className="size-[18px]" />
              <span>Joined {new Date().toLocaleString()}</span>
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

            {token.social?.twitter_url && (
              <a
                href={token.social.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                See Profile on X
              </a>
            )}
          </div>
        </div>
      }
    >
      <LeafIcon />
    </InfoBadge>
  );
}

export function TokenSocialSearch({ token }: SocialHoverTooltipProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        openOnHover
        delay={0}
      >
        <InfoBadge>
          <Search />
        </InfoBadge>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-fit max-w-62.5"
      >
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://google.com/search?q=${token.name}+token`}
          className="truncate"
        >
          <SimpleIcon icon={siGoogle} /> Google for{" "}
          <span className="truncate">{token.name}</span>
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token.symbol}+token`}
          className="truncate"
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
          X search for <span className="truncate">{token.symbol}</span>
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token.mint}+token`}
          className="truncate"
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
          X search for <span className="truncate">{token.mint}</span>
        </DropdownMenuLinkItem>
        {token.creator && (
          <DropdownMenuLinkItem
            target="_blank"
            href={`https://x.com/search?q=${token.creator}`}
            className="truncate"
          >
            <SimpleIcon
              icon={siX}
              className="text-foreground"
            />
            X search for DEV <span className="truncate">{token.creator}</span>
          </DropdownMenuLinkItem>
        )}
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token.symbol}`}
          className="truncate"
        >
          <SimpleIcon icon={siYoutube} />
          YouTube search for <span className="truncate">{token.symbol}</span>
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token.symbol}`}
          className="truncate"
        >
          <SimpleIcon
            icon={siTiktok}
            className="text-foregound"
          />
          TikTok search for <span className="truncate">{token.symbol}</span>
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TokenViewCount({ token }: { token: TokenDetail }) {
  return (
    <InfoBadge tooltip={"Currently viewing"}>
      <Eye /> N/A
    </InfoBadge>
  );
}

export function TokenWebsite({ token }: { token: TokenDetail }) {
  if (!token.social?.website_url) return null;

  return (
    <InfoBadge
      tooltip={
        <InfoBadgeTooltipRow
          label="Website"
          value={
            <a
              href={token.social.website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {token.social.website_url}
            </a>
          }
        />
      }
      aria-label="Website"
    >
      <Globe />
    </InfoBadge>
  );
}

export function TokenConnection({ token }: { token: TokenDetail }) {
  if (!token.social?.twitter_url) return null;

  return (
    <InfoBadge
      tooltip={
        <InfoBadgeTooltipRow
          label="X Connection"
          value={
            <a
              href={token.social.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {token.social.twitter_url}
            </a>
          }
        />
      }
      aria-label="Token connection"
    >
      <AlertCircle />
    </InfoBadge>
  );
}
