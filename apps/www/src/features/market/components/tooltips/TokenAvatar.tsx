"use client";

import type React from "react";
import { useRef } from "react";
import { siGoogle, siX } from "simple-icons";
import type { TokenDetail } from "@rhivadotfun/dataapi";
import {
  AtSign,
  Check,
  ChefHat,
  Copy,
  EyeOff,
  MessageSquareText,
  User,
} from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap.util";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { PumpFunIcon, SimpleIcon } from "@/components/ui/icons";
import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TokenAvatarBorderSvg = ({
  strokeLengthInPercent = 0,
  ...props
}: React.ComponentProps<"svg"> & { strokeLengthInPercent?: number }) => {
  const containerRef = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      gsap.to("[data-slot=bonding-curve-progress]", {
        drawSVG: `0% ${strokeLengthInPercent}%`,
      });
    },
    { scope: containerRef, dependencies: [strokeLengthInPercent] },
  );

  return (
    <svg
      ref={containerRef}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
      className={cn("absolute inset-0 stroke-accent", props?.className)}
    >
      <title>Token bonding curve progress</title>
      {/* Border images.. one for the border, one for bonding curve progress */}
      <path
        d="M 24,20 A 4,4 0 0,1 20,24   H 4 A 4,4 0 0,1 0,20   V 4 A 4,4 0 0,1 4,0   H 20 A 4,4 0 0,1 24,4   V 20 Z"
        className="opacity-30"
      />
      <path
        d="M 24,20 A 4,4 0 0,1 20,24   H 4 A 4,4 0 0,1 0,20   V 4 A 4,4 0 0,1 4,0   H 20 A 4,4 0 0,1 24,4   V 20 Z"
        data-slot="bonding-curve-progress"
      />
    </svg>
  );
};

interface TokenAvatarProps {
  token: TokenDetail;
  size?: "default" | "sm";
}

export function TokenAvatar({ token, size = "default" }: TokenAvatarProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<div />}>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: prevents propagation to the main token navigation */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: prevents propagation to the main token navigation */}
        <div
          className={cn(
            "group/token-avatar relative flex items-center justify-start rounded-[3px] p-1",
            size === "sm" ? "sm:size-12.25" : "size-9 shrink-0 sm:size-14",
          )}
          style={{ "--accent": "var(--color-primary)" } as React.CSSProperties}
          onClick={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.closest("button, a, [role=button")
            ) {
              e.stopPropagation();
            }
          }}
        >
          <Avatar
            variant="square"
            className={cn("group/image relative size-full shrink-0")}
          >
            <AvatarImage src={token.logo_uri ?? ""} />
            <AvatarFallback>
              {token.name ? getInitials(token.name) : <User />}
            </AvatarFallback>
          </Avatar>

          <TokenAvatarBorderSvg
            className="stroke-accent"
            strokeLengthInPercent={token.bonding?.completion_pct ?? 0}
          />
          <PumpFunIcon className="translate-1/2 absolute right-0 bottom-0 z-10 size-2 rounded-full border border-current bg-background p-px text-accent sm:size-3" />

          {/* Actions */}
          <div className="pointer-events-none absolute -top-3 left-0 flex -translate-x-1/2 flex-col opacity-0 transition-all *:bg-background group-hover/token-avatar:pointer-events-auto group-hover/token-avatar:opacity-100">
            <Button
              size="icon-xs"
              variant="outline"
              tooltip="Hide token"
            >
              <EyeOff />
            </Button>
            <Button
              size="icon-xs"
              variant="outline"
              tooltip="Blacklist dev"
            >
              <ChefHat />
            </Button>
            <Button
              size="icon-xs"
              variant="outline"
              tooltip="Blacklist handle"
            >
              <AtSign />
            </Button>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="start"
        className="px-2 py-2"
      >
        <Avatar
          variant="square"
          className={"size-59"}
        >
          <AvatarImage src={token.logo_uri ?? ""} />
          <AvatarFallback>
            {token.name ? getInitials(token.name) : <User />}
          </AvatarFallback>
        </Avatar>
      </TooltipContent>
    </Tooltip>
  );
}

export function TokenNameAndSymbol({ token }: { token: TokenDetail }) {
  const { copy } = useCopyToClipboard();

  return (
    <DropdownMenu>
      <div className="flex max-w-[20ch] items-center gap-1 text-sm">
        <span
          className="font-semibold"
          data-slot={"token-symbol"}
        >
          {token.symbol}
        </span>
        <DropdownMenuTrigger
          className="flex items-center gap-1 truncate text-muted-foreground"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          openOnHover
          delay={0}
        >
          <span
            className="truncate"
            data-slot={"token-name"}
          >
            {token.name}
          </span>
          <Copy className="size-3 shrink-0" />
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent
        align="center"
        className="w-fit max-w-62.5"
      >
        <DropdownMenuItem onClick={() => copy(token.mint)}>
          <Copy />
          Copy
          <span className="truncate">{token.mint}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="truncate"
          onClick={() => copy(token.symbol ?? "")}
        >
          <Copy /> Copy <span className="truncate">{token.symbol}</span>
        </DropdownMenuItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://google.com/search?q=${token.symbol}+token`}
          className="truncate"
        >
          <SimpleIcon icon={siGoogle} /> Google for{" "}
          <span className="truncate">{token.symbol}</span>
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token.symbol}+token&src=typed_query`}
          className="truncate"
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
          X search for <span className="truncate">{token.symbol}</span>
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TokenSymbolCopy({ token }: { token: TokenDetail }) {
  const { copy, copyState } = useCopyToClipboard();

  return (
    <InfoBadge
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        copy(token.mint);
      }}
      className="cursor-pointer text-sm"
    >
      {token.mint.slice(0, 4)}...{token.mint.slice(-4)}{" "}
      {copyState === "copied" ? <Check /> : <Copy />}
    </InfoBadge>
  );
}

export function TokenDescription({ token }: { token: TokenDetail }) {
  if (!token.description) return null;

  return (
    <InfoBadge tooltip={<InfoBadgeTooltipRow label={token.description} />}>
      <MessageSquareText />
    </InfoBadge>
  );
}
