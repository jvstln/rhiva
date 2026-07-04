import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-4 py-2 text-b-4 font-medium w-fit whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        up: "border-transparent bg-up/10 text-up",
        down: "border-transparent bg-down/10 text-down",
        warning: "border-transparent bg-warning/10 text-warning",
        neutral: "border-border/80 text-grey bg-transparent",
        solid: "border-transparent bg-primary text-primary-foreground",
        outline: "border-primary/60 text-foreground bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-b-4",
        lg: "h-12 rounded-md px-6 text-b-2",
        icon: "size-9",
        pill: "h-7 rounded-full px-3 text-b-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
