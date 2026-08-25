import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Share } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
  CalendarDay,
  LpCalendarDay,
  LpPortfolioResponse,
  TokenPortfolioResponse,
} from "@rhivadotfun/dataapi";
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
import { Separator } from "@/components/ui/separator";
import { PortfolioErrorBanner } from "./PortfolioErrorBanner";
import type { PortfolioTab } from "../portfolio.schema";
import { Timeframe } from "@/features/market/market.schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCompactCurrency, formatSignedUsd } from "@/lib/finance.util";
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

type CalendarEntry = CalendarDay | LpCalendarDay;

const eventCount = (day: CalendarEntry) =>
  "trade_count" in day ? day.trade_count : day.event_count;

export function PnlCalendarDialog({
  children,
  liquidityType = "liquidityPosition",
  tokenPortfolioQuery,
  positionsQuery,
  summary,
}: {
  liquidityType?: PortfolioTab;
  tokenPortfolioQuery: UseQueryResult<TokenPortfolioResponse, Error>;
  positionsQuery: UseQueryResult<LpPortfolioResponse, Error>;
  summary?: { value: number; realized: number; unrealized: number };
  children?: React.ReactElement;
}) {
  // Open on the current month so real calendar events are visible
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeframe, setTimeframe] = useState<string>(
    Timeframe.options.at(-1) ?? "30d",
  );

  const isTrading = liquidityType === "tradingPosition";
  const query = isTrading ? tokenPortfolioQuery : positionsQuery;
  const isLoading = query.isPending && query.fetchStatus !== "paused";

  const tokenData = tokenPortfolioQuery.data;
  const lpData = positionsQuery.data;

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarByDate = new Map(
    (isTrading ? tokenData?.calendar : lpData?.calendar)?.map((day) => [
      day.date,
      eventCount(day),
    ]) ?? [],
  );

  // TODO: fee earned, total closed, months profit, win rate and total loss are
  // not exposed by the portfolio API — falls back to "-" until available.
  const metrics = {
    totalNetWorth: formatCompactCurrency(
      isTrading ? tokenData?.total_wallet_worth_usd : lpData?.total_value_usd,
    ),
    totalInvested: formatCompactCurrency(
      isTrading ? tokenData?.total_invested_usd : null,
    ),
    feeEarned: "-",
    totalClosed: "-",
    monthsProfit: "-",
    winRate: "-",
    totalProfit: formatSignedUsd(isTrading ? tokenData?.total_pnl_usd : null),
    totalLoss: "-",
  };

  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="flex flex-col p-0 sm:h-[700px] sm:max-w-5xl">
        <DialogHeader className="sr-only">
          <DialogTitle>PnL Schedule Calendar</DialogTitle>
          <DialogDescription>
            View your Profit and Loss over time.
          </DialogDescription>
        </DialogHeader>

        <PortfolioErrorBanner
          query={query}
          message="Failed to load your calendar data."
        />

        {isLoading ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Spinner className="size-10" />
          </div>
        ) : (
          <div className="flex min-h-0 w-full flex-1 flex-col sm:flex-row">
            {/* Sidebar */}
            <div className="flex shrink-0 flex-col gap-8 border-border bg-surface-1/30 p-(--padding) [--padding:--spacing(6)] max-sm:border-b sm:w-1/4 sm:border-r">
              <div className="space-y-1.5">
                <p className="text-gray text-sm">Total Net Worth</p>
                <p className="font-bold text-xl">{metrics.totalNetWorth}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div className="space-y-1.5">
                  <p className="text-gray text-sm">Total invested</p>
                  <p className="font-semibold text-base">
                    {metrics.totalInvested}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray text-sm">Fee Earned</p>
                  <p className="font-semibold text-base">{metrics.feeEarned}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray text-sm">Total Closed</p>
                  <p className="font-semibold text-base">
                    {metrics.totalClosed}
                  </p>
                </div>
              </div>

              <div className="-mx-(--padding)">
                <Separator className="" />
              </div>

              <div className="space-y-1.5">
                <p className="text-gray text-sm">Months Profit</p>
                <p className="font-bold text-xl">{metrics.monthsProfit}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div className="space-y-1.5">
                  <p className="text-gray text-sm">Win Rate</p>
                  <p className="font-semibold text-base">{metrics.winRate}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray text-sm">Total profit</p>
                  <p className="font-semibold text-base">
                    {metrics.totalProfit}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray text-sm">Total Loss</p>
                  <p className="font-semibold text-base">{metrics.totalLoss}</p>
                </div>
              </div>
            </div>

            {/* Calendar Grid area */}
            <div className="flex h-full flex-1 flex-col bg-surface-2/10 p-4 sm:p-6">
              <SharePnl
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                summary={summary}
              />

              <div className="mb-8 flex flex-wrap items-center justify-between gap-y-3">
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
                    {/* TODO: portfolio API exposes no per-day PnL to total up */}
                    <p className="font-bold text-lg">-</p>
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
                      const dayData = calendarByDate.get(dateKey);
                      const isCurrentMonth = isSameMonth(date, currentDate);
                      return (
                        <div
                          key={dateKey}
                          className={cn(
                            "flex min-h-[85px] flex-col justify-between rounded-sm border-transparent border-l-2 p-1 transition-colors sm:p-2",
                            !isCurrentMonth
                              ? "pointer-events-none opacity-0"
                              : "bg-surface-1/40",
                            dayData !== undefined && "border-l-white/20",
                          )}
                        >
                          <span
                            className={cn(
                              "font-bold text-xs",
                              isCurrentMonth
                                ? "text-white"
                                : "text-transparent",
                            )}
                          >
                            {format(date, "d")}
                          </span>
                          {dayData !== undefined ? (
                            <div className="flex flex-col items-center justify-center pt-2">
                              <span className="font-bold text-sm text-white">
                                {dayData}
                              </span>
                              <span className="mt-0.5 truncate text-[10px] text-gray">
                                {liquidityType === "tradingPosition"
                                  ? "Trades"
                                  : "Positions"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-1 items-center justify-center">
                              <span className="font-medium font-mono text-gray/40 text-sm">
                                -
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ScrollBar
                  orientation="vertical"
                  showIndicator
                />
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const SharePnl = ({
  timeframe,
  onTimeframeChange,
  summary,
}: {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  summary?: { value: number; realized: number; unrealized: number };
}) => {
  return (
    <div className="mb-4 flex justify-end gap-4 pr-4">
      <Select
        value={timeframe}
        onValueChange={(value) => {
          if (!value) return;
          onTimeframeChange(value);
        }}
      >
        <SelectTrigger
          size="sm"
          className={"w-fit"}
        >
          <Clock />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {["1d", "7d", "30d"].map((tf) => (
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

      <PnlExportDialog
        type="summary"
        timeframe={timeframe}
        summary={summary}
      >
        <Button
          variant="outline"
          size="sm"
        >
          <Share />
          Share
        </Button>
      </PnlExportDialog>
    </div>
  );
};
