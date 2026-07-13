import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  cn(
    "flex w-full min-w-0 rounded-full border border-input bg-transparent text-b-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  ),
  {
    variants: {
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-7 px-2.5 py-1 text-[0.8rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    Omit<InputVariants, "size"> {
  "data-size"?: InputVariants["size"];
}

function Input({ className, type, "data-size": size, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size: size }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
