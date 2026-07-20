"use client";
import { AtSign, ChefHat, Copy, EyeOff, User } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PumpFunIcon, SimpleIcon } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gsap, useGSAP } from "@/lib/gsap.util";
import { cn, getInitials } from "@/lib/utils";
import type { Token } from "../../market.token.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siGoogle } from "simple-icons";

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
  token: Token;
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
            size === "sm"
              ? "sm:size-[49px]"
              : "size-[36px] shrink-0 sm:size-[56px]",
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
            strokeLengthInPercent={40}
          />
          <PumpFunIcon className="translate-1/2 absolute right-0 bottom-0 z-10 size-2 rounded-full border border-current bg-background p-px text-accent sm:size-3" />

          {/* Actions */}
          <div className="-translate-x-1/2 -top-3 pointer-events-none absolute left-0 flex flex-col opacity-0 transition-all *:bg-background group-hover/token-avatar:pointer-events-auto group-hover/token-avatar:opacity-100">
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
          className={"size-[236px]"}
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

export function TokenNameAndSymbol({ token }: { token: Token }) {
  return (
    <DropdownMenu>
      <div className="flex items-center gap-1 text-base">
        <span className="truncate font-semibold">{token.name ?? "N/A"}</span>
        <DropdownMenuTrigger
          className="flex items-center gap-1 text-muted-foreground"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          openOnHover
          delay={0}
        >
          <span className="truncate">{token.symbol ?? "N/A"}</span>
          <Copy className="size-3.5" />
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent
        align="center"
        className="w-fit max-w-62.5"
      >
        <DropdownMenuItem>
          <Copy />
          Copy
          <span className="truncate">{token.mint}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="truncate">
          <Copy /> Copy <span className="truncate">{token.name}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="truncate">
          <SimpleIcon icon={siGoogle} /> Google for{" "}
          <span className="truncate">{token.name}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
