import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  Eye,
  Globe,
  Search,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { LeafIcon, SimpleIcon, XIcon } from "@/components/ui/icons";
import { getInitials } from "@/lib/utils";
import type { Token } from "../../market.token.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import { siGoogle, siTiktok, siX, siYoutube } from "simple-icons";

interface SocialHoverTooltipProps {
  token: Token;
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
            {token.image && (
              <picture>
                <img
                  src={token.image}
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
                <AvatarImage src={token.image || ""} />
                <AvatarFallback>
                  {token.name ? getInitials(token.name) : <User />}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon-sm"
                variant={"ghost"}
                onClick={() =>
                  token.socials.twitterUrl
                    ? window.open(token.socials.twitterUrl, "_blank")
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
                @{token.socials.twitterHandle}
              </span>
            </div>

            {/* Bio */}
            <p className="text-muted-foreground text-sm">
              {token.socials.twitterHandle}
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

            {token.socials.twitterUrl && (
              <a
                href={token.socials.twitterUrl}
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
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token.dev.address}`}
          className="truncate"
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
          X search for DEV <span className="truncate">{token.dev.address}</span>
        </DropdownMenuLinkItem>
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

export function TokenViewCount({ token }: { token: Token }) {
  return (
    <InfoBadge tooltip={"Currently viewing"}>
      <Eye /> {token.viewCount}
    </InfoBadge>
  );
}

export function TokenWebsite({ token }: { token: Token }) {
  if (!token.socials.websiteUrl) return null;

  return (
    <InfoBadge
      tooltip={
        <InfoBadgeTooltipRow
          label="Website"
          value={
            <a
              href={token.socials.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {token.socials.websiteUrl}
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

export function TokenConnection({ token }: { token: Token }) {
  if (!token.socials.twitterUrl) return null;

  return (
    <InfoBadge
      tooltip={
        <InfoBadgeTooltipRow
          label="X Connection"
          value={
            <a
              href={token.socials.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {token.socials.twitterUrl}
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
