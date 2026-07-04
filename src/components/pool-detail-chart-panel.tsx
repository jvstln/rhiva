import { ChevronUp } from "lucide-react";
import { CANDLES } from "@/lib/mock/token-detail-data";
import { CandlestickChart } from "./candle-stick-chart";
import { ChartToolRail } from "./chart-tool-rail";
import { ChartToolbar } from "./chart-toolbar";

import { PositionsPanel } from "./positions-panel";

export function PoolDetailChartPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-b-2 font-semibold text-white underline underline-offset-4">
          Price Chart
        </p>
        <ChevronUp className="size-4 text-grey" />
      </div>
      <ChartToolbar />
      <div className="flex">
        <ChartToolRail />
        <div className="relative flex-1">
          <CandlestickChart data={CANDLES} />
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-b-4 font-semibold text-grey/60">
            Powered by <span className="text-grey/80">GMGN</span>
          </p>
        </div>
      </div>

      <PositionsPanel />
    </div>
  );
}
