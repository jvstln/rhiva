"use client";

import type * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SheetSide = "top" | "right" | "bottom" | "left";

const sideStyles: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 h-auto border-b slide-in-from-top-full slide-out-to-top-full",
  right:
    "inset-y-0 right-0 h-full border-l slide-in-from-right-full slide-out-to-right-full",
  bottom:
    "inset-x-0 bottom-0 h-auto border-t slide-in-from-bottom-full slide-out-to-bottom-full",
  left: "inset-y-0 left-0 h-full border-r slide-in-from-left-full slide-out-to-left-full",
};

namespace Sheet {
  export type Props = SheetPrimitive.Root.Props;
  export type TriggerProps = SheetPrimitive.Trigger.Props;
  export type CloseProps = SheetPrimitive.Close.Props;
  export type PortalProps = SheetPrimitive.Portal.Props;
  export type ContentProps = SheetPrimitive.Popup.Props & {
    side?: SheetSide;
    showCloseButton?: boolean;
  };
  export type TitleProps = SheetPrimitive.Title.Props;
  export type DescriptionProps = SheetPrimitive.Description.Props;
}

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return (
    <SheetPrimitive.Root
      data-slot="sheet"
      {...props}
    />
  );
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      {...props}
    />
  );
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return (
    <SheetPrimitive.Portal
      data-slot="sheet-portal"
      {...props}
    />
  );
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      {...props}
    />
  );
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/40 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: SheetSide;
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col bg-background text-foreground shadow-lg outline-none duration-200 data-closed:animate-out data-open:animate-in",
          side === "left" || side === "right"
            ? "w-full max-w-xs p-4"
            : "w-full p-4",
          sideStyles[side],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute inset-e-2 top-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-1 border-b pb-3", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-medium text-base", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

const createSheetHandle = SheetPrimitive.createHandle;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  createSheetHandle,
};
