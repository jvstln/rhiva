import { ArrowDownUp, Ban, Filter, LayoutList, Settings } from "lucide-react";
import { SettingsDialog } from "@/features/settings/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { BlacklistDialog } from "./BlacklistDialog";
import { RadarCustomizeDialog } from "./RadarCustomizeDialog";
import { RadarFilterDialog } from "./RadarFilterDialog";
import { RadarQuickSellDialog } from "./RadarQuickSellDialog";

export const RadarToolbar = () => {
  return (
    <div className="flex items-center">
      <RadarCustomizeDialog>
        <Button variant="ghost" size="sm">
          <LayoutList className="text-yellow-500" />
          Customize
        </Button>
      </RadarCustomizeDialog>

      <BlacklistDialog>
        <Button variant="ghost" size="sm">
          <Ban className="text-orange-500" />
          Blacklist
        </Button>
      </BlacklistDialog>

      <RadarFilterDialog>
        <Button variant="ghost" size="sm">
          <Filter className="text-muted-foreground" />
          Filter
        </Button>
      </RadarFilterDialog>

      <RadarQuickSellDialog>
        <Button variant="ghost" size="sm">
          <ArrowDownUp className="text-blue-500" />
          Quick sell
        </Button>
      </RadarQuickSellDialog>

      <SettingsDialog defaultTab="trading-settings">
        <Button variant="ghost" size="sm">
          <Settings className="text-purple-500" />
          Settings
        </Button>
      </SettingsDialog>
    </div>
  );
};
