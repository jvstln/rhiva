import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface MetricChipProps {
  icon: LucideIcon;
  value: string | number;
  tone?: "default" | "up" | "down" | "warning";
  filled?: boolean;
}

const TONE_CLASSES: Record<NonNullable<MetricChipProps["tone"]>, string> = {
  default: "text-grey",
  up: "text-up",
  down: "text-down",
  warning: "text-warning",
};

export function MetricChip({
  icon: Icon,
  value,
  tone = "default",
  filled,
}: MetricChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-b-4 font-medium",
        filled ? "bg-secondary/60" : "",
        TONE_CLASSES[tone],
      )}
    >
      <Icon className="size-3" />
      {value}
    </span>
  );
}

interface InlineStatProps {
  icon: LucideIcon;
  value: string | number;
  tone?: MetricChipProps["tone"];
}

/** Ultra-compact variant used in the single-line stat strip. */
export function InlineStat({
  icon: Icon,
  value,
  tone = "default",
}: InlineStatProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-b-5",
        TONE_CLASSES[tone],
      )}
    >
      <Icon className="size-2.5" />
      {value}
    </span>
  );
}
