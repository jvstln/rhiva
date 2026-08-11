"use client";

import { useState } from "react";
import { debounce } from "lodash";
import { Activity, Coins, Fuel, PercentIcon, Shield, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Preset } from "../market.schema";
import { SolanaIcon } from "@/components/ui/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const PresetToggle = ({ ...props }: ToggleGroup.Props) => {
  return (
    <ToggleGroup
      size={"sm"}
      spacing={0}
      defaultValue={["p1"]}
      {...props}
    >
      {Preset.options.map((p) => (
        <Tooltip key={p}>
          <TooltipTrigger
            render={
              <ToggleGroupItem
                className="uppercase"
                value={p}
              >
                {p}
              </ToggleGroupItem>
            }
          />
          <TooltipContent
            side="bottom"
            className={"flex-col items-start"}
          >
            <div className="flex items-center gap-3">
              <Activity className="size-4 text-muted-foreground" />
              <span>20%</span>
            </div>
            <div className="flex items-center gap-3">
              <Fuel className="size-4 text-muted-foreground" />
              <span>0.001</span>
            </div>
            <div className="flex items-center gap-3">
              <Coins className="size-4 text-muted-foreground" />
              <span>0.01</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-4 text-muted-foreground" />
              <span>On</span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
};

type QuickBuyOrSellInputProps = {
  value: string | number;
  onValueChange: (value: number | null) => void;
  variant?: "default" | "minimal";
  className?: string;
};

export const QuickBuyInput = ({
  value,
  onValueChange,
  variant = "default",
  className,
}: QuickBuyOrSellInputProps) => {
  const [internalValue, setInternalValue] = useState(String(value));

  return (
    <InputGroup
      size="sm"
      className={cn(variant === "minimal" ? "w-22" : "w-36", className)}
    >
      <InputGroupInput
        type="number"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          debounce(() => {
            onValueChange(
              e.target.value === "" ? null : Number(e.target.value),
            );
          }, 500)();
        }}
        className="min-w-6"
      />
      <InputGroupAddon align={variant === "default" ? "inline-end" : undefined}>
        <SolanaIcon />
      </InputGroupAddon>
      {variant === "default" && (
        <InputGroupAddon>
          <InputGroupText>Quick buy</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export const QuickSellInput = ({
  value,
  onValueChange,
  variant = "default",
  className,
}: QuickBuyOrSellInputProps) => {
  const [internalValue, setInternalValue] = useState(String(value));

  return (
    <InputGroup
      size="sm"
      className={cn("w-36", className)}
    >
      <InputGroupInput
        type="number"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          debounce(() => {
            onValueChange(
              e.target.value === "" ? null : Number(e.target.value),
            );
          }, 500)();
        }}
        className="min-w-6"
      />
      <InputGroupAddon align={variant === "default" ? "inline-end" : undefined}>
        <PercentIcon />
      </InputGroupAddon>
      {variant === "default" && (
        <InputGroupAddon>
          <InputGroupText className="text-sell">Quick sell</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export const BuyButton = ({
  value,
  valueUnit = "SOL",
  children = "Buy",
  className,
  onClick,
  icon = <Zap />,
  ...props
}: Omit<Button.Props, "value"> & {
  value?: number | null;
  valueUnit?: string;
  icon?: React.ReactNode;
}) => {
  if (value === undefined || value === null) return null;

  return (
    <Button
      size="sm"
      variant={"soft"}
      data-require-auth
      className={cn("[&_svg:not([class*=fill])]:fill-current", className)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (value <= 0) {
          return toast.error(
            "Amount must be greater than zero. Check your settings",
          );
        }
        onClick?.(e);
      }}
      {...props}
    >
      {icon}

      <span className={cn(value > 0 && "group-hover/button:hidden")}>
        {children}
      </span>

      {value ? (
        <span className={cn(value > 0 && "hidden group-hover/button:inline")}>
          {value} {valueUnit}
        </span>
      ) : null}
    </Button>
  );
};

export const SellButton = ({
  children,
  className,
  icon,
  valueUnit,
  ...props
}: React.ComponentProps<typeof BuyButton>) => {
  return (
    <BuyButton
      className={cn("[--accent:var(--color-sell)]", className)}
      icon={icon ?? <Coins className="fill-none" />}
      valueUnit={valueUnit ?? "%"}
      {...props}
    >
      {children ?? "Sell"}
    </BuyButton>
  );
};
