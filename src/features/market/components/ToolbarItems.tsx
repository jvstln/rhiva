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

const PRIORITY_TABS = ["P1", "P2", "P3"] as const;

type PriorityTab = (typeof PRIORITY_TABS)[number];

export const BondingStageToggle = ({
  value,
  onValueChange,
}: {
  onValueChange?: (value: PriorityTab) => void;
  value?: PriorityTab;
}) => {
  return (
    <ToggleGroup
      value={value ? [value] : undefined}
      onValueChange={([value]) => onValueChange?.(value as PriorityTab)}
      size={"sm"}
      className={"flex-1"}
    >
      {PRIORITY_TABS.map((pt) => (
        <Tooltip key={pt}>
          <TooltipTrigger
            render={<ToggleGroupItem value={pt}>{pt}</ToggleGroupItem>}
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
export const QuickBuyInput = ({
  value,
  onValueChange,
}: {
  value: string | number;
  onValueChange: (value: number) => void;
}) => {
  const [internalValue, setInternalValue] = useState(String(value));

  return (
    <InputGroup size="sm" className="w-40">
      <InputGroupInput
        type="number"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          debounce(() => {
            onValueChange(Number(e.target.value));
          }, 500)();
        }}
      />
      <InputGroupAddon align="inline-end">
        <SolanaIcon />
      </InputGroupAddon>
      <InputGroupAddon>
        <InputGroupText>Quick buy</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
};
export const QuickSellInput = ({
  value,
  onValueChange,
}: {
  value: string | number;
  onValueChange: (value: number) => void;
}) => {
  const [internalValue, setInternalValue] = useState(String(value));

  return (
    <InputGroup size="sm" className="w-40">
      <InputGroupInput
        type="number"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          debounce(() => {
            onValueChange(Number(e.target.value));
          }, 500)();
        }}
      />
      <InputGroupAddon align="inline-end">
        <PercentIcon />
      </InputGroupAddon>
      <InputGroupAddon>
        <InputGroupText className="text-sell">Quick sell</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
};
