import { ArrowDown, ArrowUp, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/layout/SettingsDialog";
import { Button } from "@/components/ui/button";
import { useMarketStore } from "../market.store";
import { BondingCurveToggle } from "./ToolbarItems";

export const PumpLiveToolbar = () => {
  const filters = useMarketStore((state) => state.pumpLiveSettings.sort);
  const setSort = useMarketStore((state) => state.pumpLiveSettings.setSort);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          data-active={filters.marketCap !== null || undefined}
          onClick={() => {
            setSort(({ marketCap, ...rest }) => ({
              ...rest,
              marketCap: !marketCap
                ? "asc"
                : marketCap === "asc"
                  ? "desc"
                  : null,
            }));
          }}
        >
          MC
          {!filters.marketCap ? null : filters.marketCap === "desc" ? (
            <ArrowDown />
          ) : (
            <ArrowUp />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-active={filters.time !== null || undefined}
          onClick={() => {
            setSort(({ time, ...rest }) => ({
              ...rest,
              time: !time ? "asc" : time === "asc" ? "desc" : null,
            }));
          }}
        >
          Time
          {!filters.time ? null : filters.time === "desc" ? (
            <ArrowDown />
          ) : (
            <ArrowUp />
          )}
        </Button>
      </div>

      <SettingsDialog defaultTab="trading-settings">
        <Button variant="ghost" size="sm">
          <Settings className="text-purple-500" />
          Settings
        </Button>
      </SettingsDialog>

      <BondingCurveToggle />
    </div>
  );
};
