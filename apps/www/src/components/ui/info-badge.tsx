import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const infoBadgeVariants = cva(
  "group/info-badge inline-flex shrink-0 items-center gap-1 font-geist font-medium text-[10px] text-accent tabular-nums leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:not-[class*=size-]:size-3 [&_svg]:not-[class*=shrink-]:shrink-0 **:[[class*=--accent]]:text-accent",
  {
    variants: {
      variant: {
        inline: "",
        badge:
          "rounded-md border border-border/30 bg-accent/5 px-1 py-0.25 font-medium text-[11px]",
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
  const variableClassName = className?.split(/\s+/).filter((c) => /--/.test(c));

  const content = (
    <span
      data-slot="info-badge"
      className={cn(
        infoBadgeVariants({ variant, tone }),
        className,
        "cursor-default",
      )}
      {...props}
    >
      {children}
    </span>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="center"
        className={cn("max-w-[280px] font-geist", variableClassName)}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
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
