import {
  Camera,
  ChevronDown,
  Redo2,
  Settings,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const TIMEFRAMES = ["1s", "1m", "5m", "1h", "4h", "D"] as const;

interface ChartToolbarProps {
  activeTimeframe?: (typeof TIMEFRAMES)[number];
}

export function ChartToolbar({ activeTimeframe = "1m" }: ChartToolbarProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border/70 px-4 py-2.5">
      <div className="flex items-center gap-3">
        {TIMEFRAMES.map((tf) => (
          <button
            type="button"
            key={tf}
            className={cn(
              "text-b-3 font-medium",
              tf === activeTimeframe
                ? "text-white"
                : "text-grey hover:text-white/70",
            )}
          >
            {tf}
          </button>
        ))}
        <ChevronDown className="size-4 text-grey" />
      </div>

      <SlidersHorizontal className="size-4 text-grey" />

      <button
        type="button"
        className="text-b-3 font-medium text-grey hover:text-white/70"
      >
        Indicators
      </button>

      <div className="flex items-center gap-1 text-b-3 font-medium">
        <span className="text-primary">Price</span>
        <span className="text-grey">/ Mcap</span>
      </div>

      <div className="ml-auto flex items-center gap-3 text-grey">
        <Undo2 className="size-4" />
        <Redo2 className="size-4" />
        <Settings className="size-4" />
        <Camera className="size-4" />
      </div>
    </div>
  );
}
