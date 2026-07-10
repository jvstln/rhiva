"use client";
import { debounce } from "lodash";
import { Activity, Coins, Fuel, PercentIcon, Shield } from "lucide-react";
import { useState } from "react";
import { SolanaIcon } from "@/components/ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BondingCurve } from "../market.schema";

export const BondingCurveToggle = ({
  value,
  onValueChange,
}: {
  onValueChange?: (value: BondingCurve) => void;
  value?: BondingCurve;
}) => {
  return (
    <ToggleGroup
      value={value ? [value] : undefined}
      onValueChange={([value]) => onValueChange?.(value as BondingCurve)}
      size={"sm"}
      spacing={0}
      className={"flex-1"}
    >
      {BondingCurve.options.map((p) => (
        <Tooltip key={p}>
          <TooltipTrigger
            render={
              <ToggleGroupItem className="uppercase" value={p}>
                {p}
              </ToggleGroupItem>
            }
          />
          <TooltipContent side="bottom" className={"flex-col items-start"}>
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
    <InputGroup size="sm" className={cn("w-40", className)}>
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
    <InputGroup size="sm" className={cn("w-40", className)}>
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
