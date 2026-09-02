"use client";

import type { Timeframe } from "../market.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TimeframeFilterProps = {
  timeframes: readonly Timeframe[];
  value: Timeframe;
  onValueChange: (timeframe: Timeframe) => void;
};

export const TimeframeFilter = ({
  timeframes,
  value,
  onValueChange,
}: TimeframeFilterProps) => {
  return (
    <>
      <div className="w-fit sm:hidden">
        <Select
          value={value}
          onValueChange={(timeframe) => {
            if (timeframe) onValueChange(timeframe);
          }}
        >
          <SelectTrigger
            size="sm"
            className="w-full"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((timeframe) => (
              <SelectItem
                key={timeframe}
                value={timeframe}
              >
                {timeframe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ToggleGroup
        className="hidden sm:flex"
        value={[value]}
        onValueChange={([timeframe]) => {
          if (timeframe) onValueChange(timeframe as Timeframe);
        }}
        size="sm"
      >
        {timeframes.map((timeframe) => (
          <ToggleGroupItem
            key={timeframe}
            value={timeframe}
          >
            {timeframe}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  );
};
