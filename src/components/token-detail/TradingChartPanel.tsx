import { CANDLES } from "@/data/token-detail-data";

import { CandlestickChart } from "./CandlestickChart";
import { ChartToolbar } from "./ChartToolbar";
import { ChartToolRail } from "./ChartToolRail";

export function TradingChartPanel() {
  return (
    <div className="flex flex-1 flex-col border-r border-border/70">
      <ChartToolbar />
      <div className="flex flex-1">
        <ChartToolRail />
        <div className="relative flex-1">
          <CandlestickChart data={CANDLES} />
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-b-4 font-semibold text-grey/60">
            Powered by <span className="text-grey/80">GMGN</span>
          </p>
        </div>
      </div>
    </div>
  );
}
