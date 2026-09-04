import { ArrowDownUp, Ban, Filter, LayoutList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlacklistDialog } from "./BlacklistDialog";
import { RadarFilterDialog } from "./RadarFilterDialog";
import { RadarCustomizeDialog } from "./RadarCustomizeDialog";
import { RadarQuickSellDialog } from "./RadarQuickSellDialog";

export const RadarToolbar = () => {
  return (
    <div className="flex items-center">
      <RadarCustomizeDialog>
        <Button
          variant="ghost"
          size="sm"
        >
          <LayoutList className="text-yellow-500" />
          Customize
        </Button>
      </RadarCustomizeDialog>

      <BlacklistDialog>
        <Button
          variant="ghost"
          size="sm"
        >
          <Ban className="text-orange-500" />
          Blacklist
        </Button>
      </BlacklistDialog>

      <RadarFilterDialog>
        <Button
          variant="ghost"
          size="sm"
        >
          <Filter className="text-muted-foreground" />
          Filter
        </Button>
      </RadarFilterDialog>

      <RadarQuickSellDialog>
        <Button
          variant="ghost"
          size="sm"
        >
          <ArrowDownUp className="text-blue-500" />
          Quick sell
        </Button>
      </RadarQuickSellDialog>
    </div>
  );
};
