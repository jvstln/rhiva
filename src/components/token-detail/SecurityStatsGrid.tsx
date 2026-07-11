import { CheckCircle2 } from "lucide-react";
import {
  SECURITY_AUDIT,
  SECURITY_PRIMARY,
  SECURITY_SECONDARY,
} from "@/data/token-detail-data";
import { cn } from "@/lib/utils";

function StatGrid(props: {
  items: { label: string; value: string; tone?: "down" | "warning" }[];
}) {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3">
      {props.items.map((item) => (
        <div key={item.label}>
          <p className="text-b-5 text-gray">{item.label}</p>
          <p
            className={cn(
              "font-semibold text-b-3",
              item.tone === "down" && "text-down",
              item.tone === "warning" && "text-warning",
              !item.tone && "text-white",
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SecurityStatsGrid() {
  return (
    <div className="border-border/70 border-t">
      <StatGrid items={SECURITY_PRIMARY} />
      <StatGrid items={SECURITY_SECONDARY} />
      <div className="grid grid-cols-4 gap-2 px-4 pb-3">
        {SECURITY_AUDIT.map((item) => (
          <div key={item.label}>
            <p className="text-b-5 text-gray">{item.label}</p>
            <p className="flex items-center gap-1 font-semibold text-b-3 text-white">
              {item.value}
              {item.ok && <CheckCircle2 className="size-3.5 text-up" />}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
