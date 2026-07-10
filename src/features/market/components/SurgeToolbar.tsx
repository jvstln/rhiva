import { Activity, Coins, Filter, Fuel, Rocket, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMarketStore } from "../market.store";
import { BondingCurveToggle, QuickBuyInput } from "./ToolbarItems";

const PRIORITY_TABS = ["P1", "P2", "P3"] as const;

export const SurgeToolbar = () => {
  return (
    <div className="flex min-w-max items-center gap-2">
      <span className="font-medium text-muted-foreground text-xs">
        MC Filter
      </span>
      <div className="flex items-center gap-2">
        <InputGroup size="sm" className="w-24">
          <InputGroupInput placeholder="Min" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>K</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <span className="text-muted-foreground">-</span>
        <InputGroup size="sm" className="w-24">
          <InputGroupInput placeholder="Max" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>K</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Button variant="ghost" size="sm">
        <Filter />
        Filter
      </Button>

      <SurgeQuickBuyInput />
      <SurgeBondingCurveToggle />
    </div>
  );
};

const SurgeQuickBuyInput = () => {
  const quickBuy = useMarketStore((state) => state.surgeFilters.quickBuy);
  const setFilters = useMarketStore((state) => state.setSurgeFilters);

  return (
    <QuickBuyInput
      value={quickBuy ?? ""}
      onValueChange={(value) => {
        setFilters({
          quickBuy: value,
        });
      }}
    />
  );
};

const SurgeBondingCurveToggle = () => {
  const bondingCurve = useMarketStore((state) => state.surgeFilters.preset);
  const setFilters = useMarketStore((state) => state.setSurgeFilters);

  return (
    <BondingCurveToggle
      value={bondingCurve}
      onValueChange={(value) => {
        setFilters({
          preset: value,
        });
      }}
    />
  );
};
