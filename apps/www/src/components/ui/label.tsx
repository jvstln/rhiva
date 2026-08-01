"use client";

import type * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const labelVariant = cva(
  cn(
    "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
    "group/field-label peer/field-label flex w-fit gap-2 leading-snug has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-data-checked:border-primary/30 has-data-checked:bg-primary/5 *:data-[slot=field]:p-2.5 group-data-[disabled=true]/field:opacity-50 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
    "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
  ),
);

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(labelVariant(), className)}
      {...props}
    />
  );
}

export { Label };
