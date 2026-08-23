"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

const HORIZONTAL_INDICATORS = [
  {
    key: "start",
    className:
      "inset-y-0 left-0 justify-start bg-linear-to-r pl-1 group-data-[overflow-x-start]:flex",
    Icon: ChevronLeft,
  },
  {
    key: "end",
    className:
      "inset-y-0 right-0 justify-end bg-linear-to-l pr-1 group-data-[overflow-x-end]:flex",
    Icon: ChevronRight,
  },
];

const VERTICAL_INDICATORS = [
  {
    key: "start",
    className:
      "inset-x-0 top-0 h-8 w-full items-start justify-center bg-linear-to-b pt-1 group-data-[overflow-y-start]:flex",
    Icon: ChevronUp,
  },
  {
    key: "end",
    className:
      "inset-x-0 bottom-0 h-8 w-full items-end justify-center bg-linear-to-t pb-1 group-data-[overflow-y-end]:flex",
    Icon: ChevronDown,
  },
];

function ScrollIndicators({
  orientation = "both",
}: {
  orientation?: "horizontal" | "vertical" | "both";
}) {
  const showHorizontal = orientation === "horizontal" || orientation === "both";
  const showVertical = orientation === "vertical" || orientation === "both";

  return (
    <>
      {showHorizontal &&
        HORIZONTAL_INDICATORS.map(({ key, className, Icon }) => (
          <div
            key={`h-${key}`}
            className={cn(
              "pointer-events-none absolute z-10 hidden w-8 items-center from-background to-transparent",
              className,
            )}
          >
            <Icon className="size-4 text-muted-foreground" />
          </div>
        ))}
      {showVertical &&
        VERTICAL_INDICATORS.map(({ key, className, Icon }) => (
          <div
            key={`v-${key}`}
            className={cn(
              "pointer-events-none absolute z-10 hidden from-background to-transparent",
              className,
            )}
          >
            <Icon className="size-4 text-muted-foreground" />
          </div>
        ))}
    </>
  );
}

const ScrollAreaContext = React.createContext<{
  hasRootIndicator: boolean;
}>({
  hasRootIndicator: false,
});

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
    <ScrollAreaContext.Provider value={{ hasRootIndicator: showIndicator }}>
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
        {showIndicator && <ScrollIndicators orientation="both" />}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </ScrollAreaContext.Provider>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  showIndicator = true,
  showScrollBar = false,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props & {
  showIndicator?: boolean;
  showScrollBar?: boolean;
}) {
  const { hasRootIndicator } = React.useContext(ScrollAreaContext);
  const shouldShowIndicator = showIndicator && !hasRootIndicator;

  return (
    <>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        data-orientation={orientation}
        orientation={orientation}
        className={cn(
          "flex touch-none select-none overflow-hidden p-px transition-colors data-horizontal:h-2.5 data-vertical:h-full data-vertical:w-2.5 data-horizontal:flex-col data-vertical:border-s data-vertical:border-s-transparent data-horizontal:border-t data-horizontal:border-t-transparent",
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
      {shouldShowIndicator && <ScrollIndicators orientation={orientation} />}
    </>
  );
}

export { ScrollArea, ScrollBar };
