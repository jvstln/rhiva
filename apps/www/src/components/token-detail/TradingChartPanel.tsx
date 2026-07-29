import { CANDLES } from "@/components/ui/data/token-detail-data";

import { CandlestickChart } from "./CandlestickChart";
import { ChartToolbar } from "./ChartToolbar";
import { ChartToolRail } from "./ChartToolRail";

export function TradingChartPanel() {
  return (
    <div className="flex flex-1 flex-col border-border/70 border-r">
      <ChartToolbar />
      <div className="flex flex-1">
        <ChartToolRail />
        <div className="relative flex-1">
          <CandlestickChart data={CANDLES} />
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-semibold text-b-4 text-gray/60">
            Powered by <span className="text-gray/80">GMGN</span>
          </p>
        </div>
      </div>
    </div>
  );
}
