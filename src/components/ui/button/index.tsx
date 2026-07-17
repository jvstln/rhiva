import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { buttonTooltipHandle } from "@/components/tooltip.provider";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 data-active:bg-primary/10 data-active:border-primary/20 data-active:hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "[--accent:var(--color-foreground)] text-accent hover:bg-accent/10 hover:text-accent aria-expanded:bg-accent/10 aria-expanded:text-accent dark:hover:bg-accent/50 data-active:font-semibold data-active:text-primary data-active:hover:text-primary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        sell: "bg-sell text-white hover:bg-sell/90",
        soft: "[--accent:var(--color-primary)] bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
        // destructive: "bg-destructive text-white hover:bg-destructive/90",
        // outline:
        //   "border border-border bg-transparent text-foreground hover:bg-secondary",
        // secondary:
        //   "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        // ghost: "text-gray rounded-md hover:bg-secondary hover:text-foreground",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-3.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        xs: "h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export namespace Button {
  export type Props = ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants> & {
      tooltip?: React.ReactNode;
    };
}

function Button({
  className,
  variant = "default",
  size = "default",
  ref,
  tooltip,
  ...props
}: Button.Props) {
  const button = (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      aria-label={
        props["aria-label"] ||
        (typeof tooltip === "string" ? tooltip : undefined)
      }
    />
  );

  if (!tooltip) {
    return button;
  }

  return (
    <TooltipTrigger
      handle={buttonTooltipHandle}
      render={button}
      delay={0}
      payload={{ content: tooltip }}
    />
  );
}

export { Button, buttonVariants };
export * from "./copy-button";
