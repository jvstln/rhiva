import { useState } from "react";
import { ChevronLeft, ChevronRight, Share } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PnlExportDialog } from "./PnlExportDialog";
import { PortfolioErrorBanner } from "./PortfolioErrorBanner";
import { Timeframe } from "@/features/market/market.schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCompactCurrency, formatSignedUsd } from "@/lib/finance.util";
import type { CalendarDay, PortfolioPnl } from "../portfolio.type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PnlCalendarDialog({
  children,
  tokenPortfolioQuery,
  summary,
}: {
  tokenPortfolioQuery: UseQueryResult<PortfolioPnl, Error>;
  summary?: { value: number; realized: number; unrealized: number };
  children?: React.ReactElement;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeframe, setTimeframe] = useState<string>(
    Timeframe.options.at(-1) ?? "30d",
  );

  const isLoading =
    tokenPortfolioQuery.isPending &&
    tokenPortfolioQuery.fetchStatus !== "paused";
  const tokenData = tokenPortfolioQuery.data;

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarByDate = new Map<string, number>(
    tokenData?.calendar?.map((day: CalendarDay) => [
      day.date,
      day.trades_count ?? day.event_count ?? 0,
    ]) ?? [],
  );

  const totalPnl =
    tokenData?.summary?.pnl_usd ??
    (tokenData ? tokenData.realized_usd + tokenData.unrealized_usd : null);

  const metrics = {
    totalNetWorth: formatCompactCurrency(
      tokenData?.summary?.total_value_usd ?? tokenData?.total_usd,
    ),
    totalInvested: formatCompactCurrency(
      tokenData?.summary?.tradeable_value_usd ?? tokenData?.invested_usd,
    ),
    feeEarned: "-",
    totalClosed: "-",
    monthsProfit: "-",
    winRate: "-",
    totalProfit: formatSignedUsd(totalPnl),
    totalLoss: "-",
  };

  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="flex flex-col p-0 sm:h-[700px] sm:max-w-5xl">
        <DialogHeader className="sr-only">
          <DialogTitle>PnL Schedule Calendar</DialogTitle>
          <DialogDescription>
            View your PnL breakdown across the calendar.
          </DialogDescription>
        </DialogHeader>

        {tokenPortfolioQuery.isError ? (
          <div className="p-6">
            <PortfolioErrorBanner
              query={tokenPortfolioQuery}
              message="Failed to load calendar data."
            />
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden sm:h-full sm:flex-row">
            {/* Sidebar Controls & Metrics */}
            <div className="flex w-full flex-col justify-between border-border border-b p-4 sm:w-64 sm:border-r sm:border-b-0">
              <div className="flex flex-col gap-4">
                <Select
                  value={timeframe}
                  onValueChange={(val) => val && setTimeframe(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Timeframe.options.map((tf) => (
                        <SelectItem
                          key={tf}
                          value={tf}
                        >
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray">Total Net Worth</span>
                    <p className="font-semibold text-white">
                      {metrics.totalNetWorth}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray">Total Invested</span>
                    <p className="font-semibold text-white">
                      {metrics.totalInvested}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray">Total Profit</span>
                    <p className="font-semibold text-white">
                      {metrics.totalProfit}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray">Win Rate</span>
                    <p className="font-semibold text-white">
                      {metrics.winRate}
                    </p>
                  </div>
                </div>
              </div>

              {summary && (
                <div className="pt-4">
                  <PnlExportDialog
                    type="summary"
                    summary={summary}
                    timeframe={timeframe}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <Share className="mr-2 size-4" />
                      Share Summary
                    </Button>
                  </PnlExportDialog>
                </div>
              )}
            </div>

            {/* Calendar Grid */}
            <div className="flex flex-1 flex-col overflow-hidden p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">
                  {format(currentDate, "MMMM yyyy")}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px rounded-t-lg bg-border/40 text-center font-medium text-gray text-xs">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="flex h-64 items-center justify-center">
                    <Spinner className="size-8" />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1 pt-1">
                    {daysInGrid.map((date) => {
                      const dateKey = format(date, "yyyy-MM-dd");
                      const count = calendarByDate.get(dateKey);
                      const isCurrentMonth = isSameMonth(date, currentDate);

                      return (
                        <div
                          key={dateKey}
                          className={cn(
                            "flex min-h-16 flex-col justify-between rounded-lg border border-border/40 p-1.5",
                            !isCurrentMonth && "opacity-30",
                          )}
                        >
                          <span className="font-medium text-gray text-xs">
                            {format(date, "d")}
                          </span>
                          {count !== undefined && count > 0 ? (
                            <div className="text-center">
                              <span className="font-bold text-sm text-white">
                                {count}
                              </span>
                              <span className="block text-[10px] text-gray">
                                Trades
                              </span>
                            </div>
                          ) : (
                            <div className="text-center text-gray/40 text-xs">
                              -
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <ScrollBar />
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
