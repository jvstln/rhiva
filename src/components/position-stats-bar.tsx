import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_SUMMARY } from "@/lib/mock/portfolio-data";
import { cn } from "@/lib/utils";

const TABS = ["Trading Position", "Lp Positions"] as const;

export function PositionStatsBar() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Trading Position");

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md border px-4 py-2 text-b-3 font-medium transition-colors",
              tab === t
                ? "border-primary/60 bg-primary/10 text-white"
                : "border-border/70 text-grey hover:text-white/80",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-6 py-5">
        <div className="flex flex-wrap gap-10">
          <Stat
            label="TOTAL VALUE"
            value={PORTFOLIO_SUMMARY.totalValue}
            change={PORTFOLIO_SUMMARY.totalValueChange}
          />
          <Stat
            label="UNREALIZED PNL"
            value={PORTFOLIO_SUMMARY.unrealizedPnl}
          />
          <Stat
            label="TRADEABLE BALANCE"
            value={PORTFOLIO_SUMMARY.tradeableBalance}
          />
        </div>
        <Button className="min-w-24">PnL</Button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <div>
      <p className="text-b-4 font-medium tracking-wide text-grey">{label}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-h6 font-bold text-white">{value}</span>
        {change && (
          <span
            className={cn(
              "text-b-3 font-medium",
              change.startsWith("-") ? "text-down" : "text-up",
            )}
          >
            {change}
          </span>
        )}
      </p>
    </div>
  );
}
