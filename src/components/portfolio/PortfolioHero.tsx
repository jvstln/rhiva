import { ChevronDown, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PORTFOLIO_SUMMARY } from "@/data/portfolio-data";
import { SwapDialog } from "./SwapDialog";
import { TokenDialog } from "./TokenDialog";

export function PortfolioHero() {
  return (
    <div
      className="relative flex flex-col items-center overflow-hidden rounded-xl border border-border/70 px-6 py-14 text-center"
      style={{
        backgroundImage:
          "radial-gradient(60% 90% at 50% 100%, color-mix(in oklch, var(--primary) 18%, transparent), transparent), linear-gradient(180deg, var(--surface-1), var(--background))",
      }}
    >
      <p className="flex items-center gap-1.5 text-b-2 text-gray">
        Est. total value <Eye className="size-4" />
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-h2 font-bold text-white">
          {PORTFOLIO_SUMMARY.totalValue}
        </span>
        <button
          type="button"
          className="flex items-center gap-0.5 text-b-2 font-medium text-gray"
        >
          USD <ChevronDown className="size-4" />
        </button>
      </div>

      <p className="mt-1 text-b-3 text-gray">
        Today's PnL {PORTFOLIO_SUMMARY.todaysPnl}
      </p>

      <div className="mt-6 flex *:grow min-w-xs items-center gap-3">
        <TokenDialog>
          <Button variant="outline">Token</Button>
        </TokenDialog>
        <SwapDialog>
          <Button>Swap</Button>
        </SwapDialog>
      </div>
    </div>
  );
}
