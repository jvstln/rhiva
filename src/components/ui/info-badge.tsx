import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const infoBadgeVariants = cva(
  "inline-flex items-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        badge:
          "gap-1 rounded-md px-1.5 py-1 font-medium text-b-4 tabular-nums border",
        inline:
          "gap-0.5 font-medium text-b-5 tabular-nums border border-transparent",
        icon: "justify-center size-3.5 hover:opacity-80 rounded-sm border border-transparent",
      },
      tone: {
        default: "text-gray",
        up: "text-up",
        down: "text-down",
        warning: "text-warning",
        info: "text-dodger-blue",
        muted: "text-white/30",
      },
      filled: {
        true: "", // Handled dynamically below to use transparent/opacity backgrounds
        false: "bg-transparent border-transparent",
      },
    },
    compoundVariants: [
      {
        variant: "badge",
        filled: true,
        tone: "default",
        className: "bg-secondary/60 border-transparent",
      },
      {
        variant: "badge",
        filled: true,
        tone: "up",
        className: "bg-up/10 text-up border-up/20",
      },
      {
        variant: "badge",
        filled: true,
        tone: "down",
        className: "bg-down/10 text-down border-down/20",
      },
      {
        variant: "badge",
        filled: true,
        tone: "warning",
        className: "bg-warning/10 text-warning border-warning/20",
      },
      {
        variant: "badge",
        filled: true,
        tone: "info",
        className: "bg-dodger-blue/10 text-dodger-blue border-dodger-blue/20",
      },
      {
        variant: "badge",
        filled: false,
        tone: "default",
        className: "border-secondary/60",
      },
      {
        variant: "badge",
        filled: false,
        tone: "up",
        className: "border-up/40",
      },
      {
        variant: "badge",
        filled: false,
        tone: "down",
        className: "border-down/40",
      },
      {
        variant: "badge",
        filled: false,
        tone: "warning",
        className: "border-warning/40",
      },
      {
        variant: "badge",
        filled: false,
        tone: "info",
        className: "border-dodger-blue/40",
      },
    ],
    defaultVariants: {
      variant: "badge",
      tone: "default",
      filled: false,
    },
  },
);

export interface InfoBadgeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof infoBadgeVariants> {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  label?: React.ReactNode;
  tooltip?: React.ReactNode;
}

export const InfoBadge = ({
  className,
  variant = "badge",
  tone = "default",
  filled = false,
  icon: Icon,
  label,
  tooltip,
  onClick,
  ...props
}: InfoBadgeProps) => {
  const isInteractive = !!onClick || variant === "icon";

  const classes = cn(
    infoBadgeVariants({ variant, tone, filled }),
    // Icon specific sizing overrides
    variant === "badge" && "[&>svg]:size-3",
    variant === "inline" && "[&>svg]:size-2.5",
    variant === "icon" && "[&>svg]:size-full",
    className,
  );

  const innerContent = (
    <>
      {Icon && <Icon className="shrink-0" />}
      {label != null && label !== "" && <span>{label}</span>}
    </>
  );

  const content = isInteractive ? (
    <button type="button" onClick={onClick} className={classes} {...props}>
      {innerContent}
    </button>
  ) : (
    <span className={classes} {...props}>
      {innerContent}
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
