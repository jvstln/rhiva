import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Share } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PNL_CALENDAR_DAYS, PNL_CALENDAR_METRICS } from "@/data/portfolio-data";
import { Timeframe } from "@/features/market/market.schema";
import { cn } from "@/lib/utils";
import type { PortfolioTab } from "../portfolio.schema";
import { PnlExportDialog } from "./PnlExportDialog";

export function PnlCalendarDialog({
  children,
  liquidityType = "liquidityPosition",
}: {
  liquidityType?: PortfolioTab;
  children?: React.ReactElement;
}) {
  // Use July 2025 by default as per the mock design
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="p-0 sm:max-w-5xl">
        <DialogHeader className="sr-only">
          <DialogTitle>PnL Schedule Calendar</DialogTitle>
          <DialogDescription>
            View your Profit and Loss over time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 w-full flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="flex shrink-0 flex-col gap-8 border-border border-r bg-surface-1/30 p-(--padding) [--padding:--spacing(6)] sm:w-1/4">
            <div className="space-y-1.5">
              <p className="text-gray text-sm">Total Net Worth</p>
              <p className="font-bold text-xl">
                {PNL_CALENDAR_METRICS.totalNetWorth}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Total invested</p>
                <p className="font-semibold text-base">
                  {PNL_CALENDAR_METRICS.totalInvested}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Fee Earned</p>
                <p className="font-semibold text-base">
                  {PNL_CALENDAR_METRICS.feeEarned}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Total Closed</p>
                <p className="font-semibold text-base">
                  {PNL_CALENDAR_METRICS.totalClosed}
                </p>
              </div>
            </div>

            <div className="-mx-(--padding)">
              <Separator className="" />
            </div>

            <div className="space-y-1.5">
              <p className="text-gray text-sm">Months Profit</p>
              <p className="font-bold text-xl">
                {PNL_CALENDAR_METRICS.monthsProfit}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Win Rate</p>
                <p className="font-semibold text-base">
                  {PNL_CALENDAR_METRICS.winRate}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Total profit</p>
                <p className="font-semibold text-base">
                  {PNL_CALENDAR_METRICS.totalProfit}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Total Loss</p>
                <p className="font-semibold text-base">
                  {PNL_CALENDAR_METRICS.totalLoss}
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Grid area */}
          <div className="flex h-full flex-1 flex-col bg-surface-2/10 p-6">
            <SharePnl />

            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handlePreviousMonth}
                  className="border-border bg-surface-1/50 text-white hover:bg-surface-1"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <h2 className="font-bold text-lg uppercase tracking-wider">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleNextMonth}
                  className="border-border bg-surface-1/50 text-white hover:bg-surface-1"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="mr-4 flex items-center gap-3">
                  <p className="font-medium text-gray text-xs uppercase">
                    TOTAL MONTHLY PROFIT
                  </p>
                  <p className="font-bold text-lg">$0.00</p>
                </div>
              </div>
            </div>

            <ScrollArea className="h-full min-h-0 flex-1">
              <div className="flex flex-col">
                <div className="mb-2 grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="pb-2 text-center font-medium text-gray text-sm"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {daysInGrid.map((date) => {
                    const dateKey = format(date, "yyyy-MM-dd");
                    const dayData = PNL_CALENDAR_DAYS[dateKey];
                    const isCurrentMonth = isSameMonth(date, currentDate);
                    // Styling active days
                    const isProfit = dayData && dayData.pnl >= 0;
                    const isLoss = dayData && dayData.pnl < 0;
                    return (
                      <div
                        key={dateKey}
                        className={cn(
                          "flex min-h-[85px] flex-col justify-between rounded-sm border-transparent border-l-2 p-2 transition-colors",
                          !isCurrentMonth
                            ? "pointer-events-none opacity-0"
                            : "bg-surface-1/40",
                          isProfit && "border-l-emerald-500 bg-emerald-500/5",
                          isLoss && "border-l-red-500 bg-red-500/5",
                        )}
                      >
                        <span
                          className={cn(
                            "font-bold text-xs",
                            isCurrentMonth ? "text-white" : "text-transparent",
                          )}
                        >
                          {format(date, "d")}
                        </span>
                        {dayData ? (
                          <div className="flex flex-col items-center justify-center pt-2">
                            <span
                              className={cn(
                                "font-bold text-sm",
                                isProfit ? "text-emerald-500" : "text-red-500",
                              )}
                            >
                              {isProfit ? "+" : ""}
                              {dayData.pnl < 0
                                ? `-$${Math.abs(dayData.pnl).toFixed(2)}`
                                : `$${dayData.pnl.toFixed(2)}`}
                            </span>
                            <span
                              className={cn(
                                "mt-0.5 text-[10px]",
                                isProfit
                                  ? "text-emerald-500/80"
                                  : "text-red-500/80",
                              )}
                            >
                              {dayData.positions}{" "}
                              {liquidityType === "tradingPosition"
                                ? "Trades"
                                : "Positions"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-1 items-center justify-center">
                            <span className="font-medium font-mono text-gray/40 text-sm">
                              $0
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <ScrollBar orientation="vertical" showIndicator />
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const SharePnl = () => {
  return (
    <div className="mb-4 flex justify-end gap-4 pr-4">
      <Select defaultValue={Timeframe.options.at(-1)}>
        <SelectTrigger size="sm" className={"w-fit"}>
          <Clock />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Timeframe.options.slice(-4).map((tf) => (
              <SelectItem key={tf} value={tf}>
                {tf}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <PnlExportDialog type="summary">
        <Button variant="outline" size="sm">
          <Share />
          Share
        </Button>
      </PnlExportDialog>
    </div>
  );
};
