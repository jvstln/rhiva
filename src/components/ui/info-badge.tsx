import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const infoBadgeVariants = cva(
  "inline-flex items-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 text-[11px] leading-4 font-medium [&_svg]:not-[class*=size-]:size-3.25 [&_svg]:not-[class*=shrink-]:shrink-0 gap-1 text-accent tabular-nums",
  {
    variants: {
      variant: {
        inline: "",
        badge:
          "rounded-md px-1 py-0.25 font-medium border border-accent/80 bg-accent/7",
      },
      tone: {
        default: "[--accent:var(--color-gray)]",
        up: "[--accent:var(--color-up)]",
        down: "[--accent:var(--color-down)]",
        warning: "[--accent:var(--color-warn)]",
        info: "[--accent:var(--color-info)]",
        muted: "[--accent:var(--color-muted-foreground)]",
      },
    },
    defaultVariants: {
      variant: "inline",
      tone: "default",
    },
  },
);

export interface InfoBadgeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof infoBadgeVariants> {
  tooltip?: React.ReactNode;
}

export const InfoBadge = ({
  variant,
  tone,
  className,
  children,
  tooltip,
  ...props
}: InfoBadgeProps) => {
  const content = (
    <span
      className={cn(infoBadgeVariants({ variant, tone }), className)}
      {...props}
    >
      {children}
    </span>
  );

  if (!tooltip) return content;

  return (
    <HoverCard>
      <HoverCardTrigger delay={300}>{content}</HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="center"
        className={"w-fit max-w-[280px]"}
      >
        {tooltip}
      </HoverCardContent>
    </HoverCard>
  );

  // return (
  // <Tooltip>
  //   <TooltipTrigger>{content}</TooltipTrigger>
  //   <TooltipContent side="bottom" align="center" className="max-w-[280px]">
  //     {tooltip}
  //   </TooltipContent>
  // </Tooltip>
  // );
};

/* ------------------------------------------------------------------ */
/* Tooltip Layout Helpers                                               */
/* ------------------------------------------------------------------ */

export function InfoBadgeTooltipHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4 className={cn("mb-2 font-medium text-base text-foreground", className)}>
      {children}
    </h4>
  );
}

export function InfoBadgeTooltipRow({
  label,
  value,
  valueClassName,
}: {
  label?: React.ReactNode;
  value?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 py-0.5">
      {label && <span className="text-muted-foreground text-xs">{label}</span>}
      {value && (
        <span
          className={cn("font-medium text-foreground text-xs", valueClassName)}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function InfoBadgeTooltipGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid w-full gap-y-1">{children}</div>;
}
