import { Bot } from "lucide-react";

import { cn } from "@/lib/utils";

interface TokenThumbnailProps {
  badge?: string;
  className?: string;
}

/** Placeholder mark standing in for uploaded token art. */
export function TokenThumbnail({
  badge = "500+",
  className,
}: TokenThumbnailProps) {
  return (
    <div className={cn("relative size-16 shrink-0", className)}>
      {badge && (
        <span className="absolute -top-2 left-0 z-10 rounded-full bg-black px-1.5 py-0.5 font-semibold text-b-6 text-white ring-1 ring-border">
          {badge}
        </span>
      )}
      <div className="flex size-full items-center justify-center gap-0.5 rounded-xl border border-primary/50 bg-black">
        <span className="size-4 rounded-full bg-cyan-400" />
        <span className="size-4 rounded-full bg-rose-500" />
      </div>
      <span className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center rounded-full bg-surface-2 ring-1 ring-border">
        <Bot className="size-3 text-gray" />
      </span>
    </div>
  );
}
