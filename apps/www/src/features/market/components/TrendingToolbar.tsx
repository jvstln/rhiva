import {
  ArrowDownUp,
  Ban,
  Filter,
  PercentIcon,
  Settings,
  XIcon,
} from "lucide-react";
import { SettingsDialog } from "@/features/settings/components/SettingsDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "../../../components/ui/button";
import { useMarketStore } from "../market.store";
import { BlacklistDialog } from "./BlacklistDialog";
import { BondingCurveToggle, QuickBuyInput } from "./ToolbarItems";
import { TrendingFilterDialog } from "./TrendingFilterDialog";
import type { Timeframe } from "../market.schema";

const TIMEFRAMES: Timeframe[] = [
  "1m",
  "5m",
  "15m",
  "30m",
  "1h",
  "6h",
  "12h",
  "24h",
];

export const TrendingToolbar = () => {
  const filters = useMarketStore((s) => s.trendingFilters);
  const setFilters = useMarketStore((s) => s.setTrendingFilters);

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        value={[filters.timeframe]}
        onValueChange={([timeframe]) => {
          setFilters({ timeframe: timeframe as Timeframe });
        }}
        size={"sm"}
      >
        {TIMEFRAMES.map((tf) => (
          <ToggleGroupItem
            key={tf}
            value={tf}
          >
            {tf}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex items-center gap-2">
        <BlacklistDialog>
          <Button
            variant="ghost"
            size="sm"
          >
            <Ban className="text-orange-500" />
            Blacklist
          </Button>
        </BlacklistDialog>
        <TrendingFilterDialog>
          <Button
            variant="ghost"
            size="sm"
          >
            <Filter className="text-muted-foreground" />
            Filter
          </Button>
        </TrendingFilterDialog>

        <SettingsDialog defaultTab="trading-settings">
          <Button
            variant="ghost"
            size="sm"
          >
            <Settings className="text-purple-500" />
            Settings
          </Button>
        </SettingsDialog>

        <TrendingQuickSellInput />

        <TrendingQuickBuyInput />
      </div>

      <BondingCurveToggle />
    </div>
  );
};

export const TrendingQuickBuyInput = () => {
  const quickBuy = useMarketStore((state) => state.trendingFilters.quickBuy);

  return (
    <QuickBuyInput
      value={quickBuy ?? ""}
      onValueChange={(value) => {
        useMarketStore.setState((state) => {
          state.trendingFilters.quickBuy = value;
        });
      }}
    />
  );
};

export const TrendingQuickSellInput = () => {
  const quickSell = useMarketStore((state) => state.trendingFilters.quickSell);
  const setFilters = useMarketStore((state) => state.setTrendingFilters);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
          />
        }
      >
        <ArrowDownUp className="text-blue-500" />
        Quick sell
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Sell Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ToggleGroup
            value={[quickSell === null ? "off" : "on"]}
            onValueChange={([value]) => {
              setFilters({ quickSell: value === "off" ? null : 0 });
            }}
          >
            <ToggleGroupItem value="off">
              <XIcon />
              Off
            </ToggleGroupItem>
            <ToggleGroupItem
              variant={"sell"}
              value="on"
            >
              <ArrowDownUp />
              Sell
            </ToggleGroupItem>
          </ToggleGroup>

          {quickSell !== null && (
            <Field>
              <FieldContent className="flex-row justify-between">
                <FieldLabel>Quick sell</FieldLabel>
              </FieldContent>
              <InputGroup>
                <InputGroupInput
                  min={0}
                  value={quickSell ?? ""}
                  onChange={(e) => {
                    setFilters({
                      quickSell: Number(e.target.value),
                    });
                  }}
                />
                <InputGroupAddon>
                  <InputGroupText className="text-sell">
                    Quick sell
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon align={"inline-end"}>
                  <PercentIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button className={"w-full"} />}>
            Done
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
