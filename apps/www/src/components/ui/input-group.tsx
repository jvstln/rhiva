"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, inputVariants } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Variants = VariantProps<typeof inputVariants>;

const InputGroupContext = React.createContext<{
  size?: Variants["size"];
}>({});

function InputGroup({
  className,
  size,
  "data-size": dataSize,
  ...props
}: React.ComponentProps<"div"> &
  Variants & { "data-size"?: Variants["size"] }) {
  return (
    <InputGroupContext.Provider value={{ size }}>
      <div
        data-slot="input-group"
        role="group"
        className={cn(
          "group/input-group",
          inputVariants({ size: size ?? dataSize }),
          "relative items-center p-0 px-0 py-0", // group overrides to remove inner padding
          "focus-visible:border-input focus-visible:ring-0", // group wrapper shouldn't show focus ring itself
          "has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring",
          "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
          "has-disabled:cursor-not-allowed has-disabled:opacity-50",
          "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-start]]:h-auto has-[>textarea]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col",
          "has-[>[data-align=inline-start]]:[&>input]:ps-1.5 has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3",
          className,
        )}
        {...props}
      />
    </InputGroupContext.Provider>
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-4 has-[>button]:ms-[-0.3rem] has-[>kbd]:ms-[-0.15rem]",
        "inline-end":
          "order-last pe-4 has-[>button]:me-[-0.3rem] has-[>kbd]:me-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  const { size } = React.useContext(InputGroupContext);
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        size === "sm" ? "text-[0.8rem]" : "text-sm",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const { size } = React.useContext(InputGroupContext);
  return (
    <Input
      data-size={size}
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
