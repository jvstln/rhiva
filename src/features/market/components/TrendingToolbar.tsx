import { Ban, Filter, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/layout/SettingsDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "../../../components/ui/button";
import { useMarketStore } from "../market.store";
import { BlacklistDialog } from "./BlacklistDialog";
import {
  BondingStageToggle,
  QuickBuyInput,
  QuickSellInput,
} from "./ToolbarItems";

const TIMEFRAMES = ["1m", "5m", "1h", "6h", "24h"] as const;

export const TrendingToolbar = () => {
  return (
    <div className="flex items-center gap-2">
      <ToggleGroup defaultValue={["1h"]} size={"sm"}>
        {TIMEFRAMES.map((tf) => (
          <ToggleGroupItem key={tf} value={tf}>
            {tf}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex items-center gap-2">
        <BlacklistDialog>
          <Button variant="ghost" size="sm">
            <Ban className="text-orange-500" />
            Blacklist
          </Button>
        </BlacklistDialog>
        <Button variant="ghost" size="sm">
          <Filter className="text-muted-foreground" />
          Filter
        </Button>

        <TrendingQuickBuyInput />

        <TrendingQuickSellInput />

        <SettingsDialog defaultTab="trading-settings">
          <Button variant="ghost" size="sm">
            <Settings className="text-purple-500" />
            Settings
          </Button>
        </SettingsDialog>
      </div>

      <BondingStageToggle />
    </div>
  );
};

export const TrendingQuickBuyInput = () => {
  const quickBuy = useMarketStore((state) => state.trendingSettings.quickBuy);

  return (
    <QuickBuyInput
      value={quickBuy}
      onValueChange={(value) => {
        useMarketStore.setState((state) => {
          state.trendingSettings.quickBuy = value;
        });
      }}
    />
  );
};

export const TrendingQuickSellInput = () => {
  const quickSell = useMarketStore((state) => state.trendingSettings.quickSell);

  return (
    <QuickSellInput
      value={quickSell.value ?? ""}
      onValueChange={(value) => {
        useMarketStore.setState((state) => {
          state.trendingSettings.quickSell.value = value;
        });
      }}
    />
  );
};
