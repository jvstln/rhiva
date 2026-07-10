import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

interface MetricChipProps {
  icon: LucideIcon;
  value?: string | number | null;
  tone?: "default" | "up" | "down" | "warning" | "info";
  filled?: boolean;
  tooltip?: React.ReactNode;
}

const TONE_CLASSES: Record<NonNullable<MetricChipProps["tone"]>, string> = {
  default: "text-gray",
  up: "text-up",
  down: "text-down",
  warning: "text-warning",
  info: "text-blue-500",
};

export function MetricChip({
  icon: Icon,
  value,
  tone = "default",
  filled,
  tooltip,
}: MetricChipProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-medium text-b-4",
        filled ? "bg-secondary/60" : "",
        TONE_CLASSES[tone],
      )}
    >
      <Icon className="size-3" />
      {value != null && value !== "" && <span>{value}</span>}
    </span>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

interface InlineStatProps {
  icon: LucideIcon;
  value?: string | number | null;
  tone?: MetricChipProps["tone"];
  tooltip?: React.ReactNode;
}

/** Ultra-compact variant used in the single-line stat strip. */
export function InlineStat({
  icon: Icon,
  value,
  tone = "default",
  tooltip,
}: InlineStatProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-b-5",
        TONE_CLASSES[tone],
      )}
    >
      <Icon className="size-2.5" />
      {value != null && value !== "" && <span>{value}</span>}
    </span>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
