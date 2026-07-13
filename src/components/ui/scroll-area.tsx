"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
  showIndicator?: boolean;
};

function ScrollArea({
  className,
  children,
  showIndicator = false,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("group relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  showIndicator = true,
  showScrollBar = true,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props & {
  showIndicator?: boolean;
  showScrollBar?: boolean;
}) {
  return (
    <>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        data-orientation={orientation}
        orientation={orientation}
        className={cn(
          "flex touch-none select-none p-px transition-colors data-horizontal:h-2.5 data-vertical:h-full data-vertical:w-2.5 data-horizontal:flex-col data-vertical:border-s data-vertical:border-s-transparent data-horizontal:border-t data-horizontal:border-t-transparent",
          className,
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Thumb
          data-slot="scroll-area-thumb"
          className={cn(
            "relative flex-1 rounded-full bg-border",
            !showScrollBar && "opacity-0",
          )}
        />
      </ScrollAreaPrimitive.Scrollbar>
      {showIndicator && orientation === "horizontal" && (
        <>
          <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-0 hidden h-full w-8 items-center justify-end bg-linear-to-l from-background to-transparent pr-1 group-data-overflow-x-end:flex">
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
          <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-0 hidden h-full w-8 items-center justify-start bg-linear-to-r from-background to-transparent pl-1 group-data-overflow-x-start:flex">
            <ChevronLeft className="size-4 text-muted-foreground" />
          </div>
        </>
      )}
      {showIndicator && orientation === "vertical" && (
        <>
          <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 hidden h-8 w-full items-end justify-center bg-linear-to-t from-background to-transparent pb-1 group-data-overflow-y-end:flex">
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
          <div className="-translate-x-1/2 pointer-events-none absolute top-0 left-1/2 hidden h-8 w-full items-start justify-center bg-linear-to-b from-background to-transparent pt-1 group-data-overflow-y-start:flex">
            <ChevronUp className="size-4 text-muted-foreground" />
          </div>
        </>
      )}
    </>
  );
}

export { ScrollArea, ScrollBar };
