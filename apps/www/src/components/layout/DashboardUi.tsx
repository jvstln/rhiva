import { mergeProps, useRender } from "@base-ui/react";

import { cn } from "@/lib/utils";

export const DashboardHeader = ({
  className,
  ...props
}: useRender.ComponentProps<"h1">) => {
  const element = useRender({
    defaultTagName: "h1",
    props: mergeProps(
      { className: cn("font-bold text-h4 text-primary", className) },
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
          "text-b-2 [[data-slot=dashboard-header]~*]:mt-1",
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
        className: cn(
          "flex min-h-0 flex-col gap-6 px-(--padding-x) pt-9 pb-6 [--padding-x:--spacing(6)]",
          className,
        ),
      },
      props,
    ),
    state: { slot: "dashboard-slot" },
  });

  return element;
};
