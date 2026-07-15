import { ChevronUp } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CorePnlCardProps = {
  ref?: React.RefObject<HTMLDivElement | null>;
  image: string;
  children?: React.ReactNode;
};

const CorePnlCard = ({ ref, image, children }: CorePnlCardProps) => {
  return (
    <div ref={ref} className="@container-size relative aspect-video">
      <picture className="size-full">
        <img
          src={image}
          alt={"LP card"}
          className="aspect-video size-full max-h-full max-w-full object-cover"
        />
      </picture>
      {children}
    </div>
  );
};

const PnlLabel = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("text-[4cqb] text-muted-foreground uppercase", className)}
      data-slot="pnl-label"
    >
      {children}
    </div>
  );
};

const PnlValue = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "font-extralight text-[7cqb] uppercase",
        typeof children === "string" && {
          "text-down": children.startsWith("-"),
          "text-up": children.startsWith("+"),
        },
        className,
      )}
      data-slot="pnl-value"
    >
      {children}
    </div>
  );
};

type TokenCardProps = CorePnlCardProps & {
  tokenName?: string;
  value?: string;
  pnl?: string;
  invested?: string;
};

export function TokenCard(props: TokenCardProps) {
  return (
    <CorePnlCard {...props}>
      <div
        className="absolute inset-y-0 right-0 z-10 flex h-[100cqb] flex-col p-5 text-right"
        style={{
          background:
            "linear-gradient(to left, rgb(0 0 0 / 0.9) 30%, transparent)",
        }}
      >
        <div className="font-medium text-[10cqb]">{props.tokenName}</div>
        <div
          className={cn(
            "text-[28cqb]",
            props.value?.startsWith("-") ? "text-down" : "text-up",
          )}
        >
          {props.value}
        </div>
        <div className="mt-auto mb-4 flex justify-end gap-6">
          <div>
            <PnlLabel>PNL</PnlLabel>
            <PnlValue>{props.pnl}</PnlValue>
          </div>
          <div>
            <PnlLabel>INVESTED</PnlLabel>
            <PnlValue>{props.invested}</PnlValue>
          </div>
        </div>
      </div>
    </CorePnlCard>
  );
}

type LpCardProps = CorePnlCardProps & {
  poolName?: string;
  tvl?: string;
  pnl?: string;
  value?: string;
  timeAgo?: string;
};

export function LpCard(props: LpCardProps) {
  return (
    <CorePnlCard {...props}>
      <div
        className="absolute inset-y-0 right-0 z-10 flex h-[100cqb] flex-col gap-1 p-5 text-right"
        style={{
          background:
            "linear-gradient(to left, rgb(0 0 0 / 0.9) 30%, transparent)",
        }}
      >
        <div>
          <PnlLabel>TIME</PnlLabel>
          <PnlValue>{props.timeAgo}</PnlValue>
        </div>
        <div>
          <PnlLabel>POOL</PnlLabel>
          <PnlValue>{props.poolName}</PnlValue>
        </div>
        <div
          className={cn(
            "font-medium text-[24cqb] leading-none tracking-tight",
            props.pnl?.startsWith("-") ? "text-down" : "text-up",
          )}
        >
          {props.pnl}
        </div>
        <div className="mt-auto flex justify-end gap-6">
          <div>
            <PnlLabel>TVL</PnlLabel>
            <PnlValue>{props.tvl}</PnlValue>
          </div>
          <div>
            <PnlLabel>PNL</PnlLabel>
            <PnlValue>{props.tvl}</PnlValue>
          </div>
        </div>
      </div>
    </CorePnlCard>
  );
}

type PnlSummaryCardProps = CorePnlCardProps & {
  value: string;
  realized: string;
  unrealized: string;
  biggestWin: string;
  winRate: string;
  timeframe: string;
};

export const PnlSummaryCard = (props: PnlSummaryCardProps) => {
  const isProfit = !props.value.startsWith("-");

  return (
    <CorePnlCard {...props}>
      <div
        className="absolute inset-y-0 left-0 z-10 flex h-[100cqb] flex-col p-5 text-left"
        style={
          {
            background:
              "linear-gradient(to top right, rgb(0 0 0 / 0.9) 40%, transparent)",
            "--accent": isProfit ? "var(--color-up)" : "var(--color-down)",
            maskImage: "linear-gradient(to left, transparent 0%, black 30%)",
            WebkitMaskImage:
              "linear-gradient(to left, transparent 0%, black 30%)",
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-2 font-medium text-[8cqb]">
          {isProfit ? "GAIN" : "LOSS"} ({props.timeframe})
          <ChevronUp
            className={cn(
              "size-[8cqb] fill-current text-accent",
              isProfit ? "" : "rotate-180",
            )}
          />
        </div>
        <div className={cn("text-[25cqb] text-accent leading-none")}>
          {props.value}
        </div>
        <div className="mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 *:text-[7cqb] *:data-[slot=pnl-value]:font-medium">
          <PnlLabel>REALIZED</PnlLabel>
          <PnlValue>{props.realized}</PnlValue>
          <PnlLabel>UNREALIZED</PnlLabel>
          <PnlValue>{props.unrealized}</PnlValue>
          <PnlLabel>BIGGEST WIN</PnlLabel>
          <PnlValue>{props.biggestWin}</PnlValue>
          <PnlLabel>WIN RATE</PnlLabel>
          <PnlValue>{props.winRate}</PnlValue>
        </div>
      </div>
    </CorePnlCard>
  );
};
