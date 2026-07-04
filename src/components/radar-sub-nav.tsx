import { ArrowUpDown, LayoutGrid, Settings2, ShieldOff } from "lucide-react";
import { RADAR_TABS } from "@/lib/mock/market-data";
import { cn } from "@/lib/utils";

interface RadarSubnavProps {
  active: (typeof RADAR_TABS)[number];
}

export function RadarSubnav({ active }: RadarSubnavProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
      <div className="flex items-center gap-6">
        {RADAR_TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            className={cn(
              "text-b-1 font-medium transition-colors",
              tab === active ? "text-primary" : "text-grey hover:text-white/80",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <ActionLink icon={LayoutGrid} label="Customize" />
        <ActionLink icon={ShieldOff} label="Blacklist" />
        <ActionLink icon={ArrowUpDown} label="Quick Sell" />
        <ActionLink icon={Settings2} label="Settings" />
      </div>
    </div>
  );
}

function ActionLink({
  icon: Icon,
  label,
}: {
  icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 text-b-3 font-medium text-grey transition-colors hover:text-white/80"
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
