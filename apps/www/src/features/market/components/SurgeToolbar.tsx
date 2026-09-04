import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Preset } from "../market.schema";
import { useMarketStore } from "../market.store";
import { SurgeFilterDialog } from "./SurgeFilterDialog";
import { PresetToggle, QuickBuyInput } from "./ToolbarItems";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

export const SurgeToolbar = () => {
  const minMcap = useMarketStore((state) => state.surgeFilters.min_mcap);
  const maxMcap = useMarketStore((state) => state.surgeFilters.max_mcap);
  const setFilters = useMarketStore((state) => state.setSurgeFilters);

  return (
    <div className="flex min-w-max items-center gap-2">
      <span className="font-medium text-muted-foreground text-xs">
        MC Filter
      </span>
      <div className="flex items-center gap-2">
        <InputGroup
          size="sm"
          className="w-24"
        >
          <InputGroupInput
            value={minMcap}
            onDebouncedValueChange={(value) => {
              setFilters({ min_mcap: value });
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>K</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-start">
            <InputGroupText>Min</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <span className="text-muted-foreground">-</span>
        <InputGroup
          size="sm"
          className="w-24"
        >
          <InputGroupInput
            value={maxMcap}
            onDebouncedValueChange={(value) => {
              setFilters({ max_mcap: value });
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>K</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-start">
            <InputGroupText>Max</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Select></Select>

      <SurgeFilterDialog>
        <Button
          variant="ghost"
          size="sm"
        >
          <Filter />
          Filter
        </Button>
      </SurgeFilterDialog>

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
    <PresetToggle
      value={[bondingCurve]}
      onValueChange={([value]) => {
        setFilters({
          preset: Preset.catch("p1").parse(
            Array.isArray(value) ? value[0] : value,
          ),
        });
      }}
    />
  );
};
