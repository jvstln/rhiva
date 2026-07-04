import type { PortfolioTab } from "@/app/(dashboard)/portfolio/page";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_SUMMARY } from "@/data/portfolio-data";
import { cn } from "@/lib/utils";

interface PositionStatsBarProps {
  activeTab: PortfolioTab;
  onChangeTab: (tab: PortfolioTab) => void;
}

const TABS = ["Trading Position", "Liquidity Positions"] as const;

export function PositionStatsBar({
  activeTab,
  onChangeTab,
}: PositionStatsBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {TABS.map((t) => (
          <Button
            key={t}
            onClick={() => onChangeTab(t)}
            variant={activeTab === t ? "soft" : "outline"}
          >
            {t}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-6 py-5">
        <div className="flex flex-wrap gap-10">
          <Stat
            label="TOTAL VALUE"
            value={PORTFOLIO_SUMMARY.totalValue}
            change={PORTFOLIO_SUMMARY.totalValueChange}
          />
          {activeTab === "Trading Position" && (
            <>
              <Stat
                label="UNREALIZED PNL"
                value={PORTFOLIO_SUMMARY.unrealizedPnl}
              />
              <Stat
                label="TRADEABLE BALANCE"
                value={PORTFOLIO_SUMMARY.tradeableBalance}
              />
            </>
          )}
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
      <p className="text-b-4 font-medium tracking-wide text-gray">{label}</p>
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
