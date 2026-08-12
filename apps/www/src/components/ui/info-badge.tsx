import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const infoBadgeVariants = cva(
  cn(
    "group/info-badge inline-flex shrink-0 items-center gap-1 font-geist font-medium text-[10px] tabular-nums leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:not-[class*=size-]:size-3 [&_svg]:not-[class*=shrink-]:shrink-0",
    "text-[color-mix(var(--accent)_70%,var(--color-foreground))] **:[[class*=--accent]]:text-[color-mix(var(--accent)_70%,var(--color-foreground))]",
  ),
  {
    variants: {
      variant: {
        inline: "",
        none: "font-[inherit] text-[size:inherit]! text-inherit",
        badge:
          "rounded-md border border-border/30 bg-accent/5 px-1 py-px font-medium text-[11px]",
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

export namespace InfoBadge {
  export type Props = React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof infoBadgeVariants> & {
      tooltip?: React.ReactNode;
    };
}

export const InfoBadge = ({
  variant,
  tone,
  className,
  children,
  tooltip,
  ...props
}: InfoBadge.Props) => {
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
        className={cn("max-w-70 font-geist", variableClassName)}
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
    <article
      className="flex w-full items-center justify-between gap-4 py-0.5"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {label && <span className="text-muted-foreground text-xs">{label}</span>}
      {value && (
        <span
          className={cn(
            "truncate font-medium text-foreground text-xs",
            valueClassName,
          )}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </span>
      )}
    </article>
  );
}

export function InfoBadgeTooltipGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid w-full gap-y-1">{children}</div>;
}
