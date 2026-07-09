import { Layers, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColumnToolbarProps {
  showMcToggle?: boolean;
}

const TIERS = ["P1", "P2", "P3"] as const;

export function ColumnToolbar({ showMcToggle }: ColumnToolbarProps) {
  return (
    <div className="flex items-center gap-1.5">
      {showMcToggle && (
        <button
          type="button"
          className="flex items-center gap-1 font-medium text-b-4 text-gray"
        >
          % MC
        </button>
      )}
      <div className="relative w-28">
        <Input
          placeholder="Keyword1,..."
          className="h-7 rounded-md border-border/70 bg-transparent pl-2 text-b-5 placeholder:text-b-5"
        />
      </div>
      <span className="flex items-center gap-1 rounded-md border border-border/70 px-2 py-1 text-b-5 text-gray">
        <Layers className="size-3" />0
      </span>
      {TIERS.map((tier, i) => (
        <button
          type="button"
          key={tier}
          className={cn(
            "rounded-md px-1.5 py-1 font-semibold text-b-5",
            i === 0 ? "text-warning" : "text-gray",
          )}
        >
          {tier}
        </button>
      ))}
      <button
        type="button"
        className="flex size-6 items-center justify-center rounded-md text-gray hover:bg-secondary"
      >
        <SlidersHorizontal className="size-3.5" />
      </button>
    </div>
  );
}
