import { mergeProps, useRender } from "@base-ui/react";
import { cn } from "@/lib/utils";

export const DashboardHeader = ({
  className,
  ...props
}: useRender.ComponentProps<"h1">) => {
  const element = useRender({
    defaultTagName: "h1",
    props: mergeProps(
      { className: cn("text-h4 font-bold text-primary", className) },
      props,
    ),
    state: { slot: "dashboard-header" },
  });

  return element;
};

export const DashboardDescription = ({
  className,
  ...props
}: useRender.ComponentProps<"p">) => {
  const element = useRender({
    defaultTagName: "p",
    props: mergeProps(
      {
        className: cn(
          "[[data-slot=dashboard-header]~*]:mt-1 text-b-2",
          className,
        ),
      },
      props,
    ),
    state: { slot: "dashboard-description" },
  });

  return element;
};

export const DashboardSlot = ({
  className,
  ...props
}: useRender.ComponentProps<"div">) => {
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps(
      {
        className: cn("flex flex-col gap-6 px-6 pt-8 pb-6", className),
      },
      props,
    ),
    state: { slot: "dashboard-slot" },
  });

  return element;
};
