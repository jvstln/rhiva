import type * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { buttonTooltipHandle } from "@/providers/ToolTipProvider";
import { TooltipTrigger } from "@/components/ui/tooltip";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground data-active:border-primary/20 data-active:bg-primary/10 data-active:hover:bg-primary/20 dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "text-accent [--accent:var(--color-foreground)] hover:bg-accent/10 hover:text-accent aria-expanded:bg-accent/10 aria-expanded:text-accent data-active:font-semibold data-active:text-primary data-active:hover:text-primary dark:hover:bg-accent/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
        sell: "bg-sell text-white hover:bg-sell/90",
        soft: "border-accent/20 bg-accent/10 text-accent [--accent:var(--color-primary)] hover:bg-accent/20",
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
          "h-10 gap-1.5 px-3.5 has-data-[icon=inline-start]:ps-2 has-data-[icon=inline-end]:pe-2",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg px-2 text-xs has-data-[icon=inline-start]:ps-1.5 has-data-[icon=inline-end]:pe-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg px-2.5 text-[0.8rem] has-data-[icon=inline-start]:ps-1.5 has-data-[icon=inline-end]:pe-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-2.5 has-data-[icon=inline-start]:ps-2 has-data-[icon=inline-end]:pe-2",
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
      loading?: boolean;
      loadingText?: React.ReactNode;
    };
}

function Button({
  className,
  variant = "default",
  size = "default",
  ref,
  tooltip,
  loading,
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
      disabled={loading || props.disabled}
    >
      {loading ? <Spinner /> : props.children}
    </ButtonPrimitive>
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
