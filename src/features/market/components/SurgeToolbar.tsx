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
        <Filter className="text-muted-foreground" />
        Filter
      </Button>
      <InputGroup size="sm" className="w-24">
        <InputGroupAddon align="inline-start">
          <SolanaIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="0" defaultValue="0" />
      </InputGroup>
      <ToggleGroup size={"sm"}>
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
      <Toggle size="sm" variant="outline" className="gap-2 border-transparent">
        <Rocket className="size-4" />
        OFF
      </Toggle>
    </div>
  );
};
