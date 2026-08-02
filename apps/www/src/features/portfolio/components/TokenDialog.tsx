"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { TokenPortfolioResponse } from "@rhivadotfun/dataapi";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PortfolioErrorBanner } from "./PortfolioErrorBanner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCompactCurrency } from "@/lib/finance.util";
import { SwapDialog } from "../../transaction/components/SwapDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formatTokenAmount = (amount: number) => {
  if (amount >= 1000)
    return amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return amount.toLocaleString("en-US", { maximumFractionDigits: 4 });
};

export function TokenDialog({
  query,
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof Dialog> & {
  query: UseQueryResult<TokenPortfolioResponse, Error>;
  children: React.ReactElement;
}) {
  const isLoading = query.isPending && query.fetchStatus !== "paused";
  const tokens = query.data?.tokens;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent className="p-0 sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Portfolio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-5">
          <PortfolioErrorBanner
            query={query}
            message="Failed to load your tokens."
          />

          {/* Portfolio Summary */}
          <div className="rounded-xl border border-border/70 bg-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-b-4 text-gray uppercase tracking-wider">
                  Total Value
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <h2 className="font-bold text-h4 text-white">
                    {isLoading ? (
                      <Spinner className="size-5" />
                    ) : (
                      formatCompactCurrency(query.data?.total_wallet_worth_usd)
                    )}
                  </h2>

                  {/* TODO: portfolio API exposes no 24h change per wallet */}
                  <span className="font-semibold text-b-3 text-gray">-</span>
                </div>
              </div>

              <SwapDialog>
                <Button className="min-w-24 self-start px-6 sm:self-auto">
                  Swap
                </Button>
              </SwapDialog>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border/70">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] border-border/70 border-b bg-muted/20 px-5 py-3 font-semibold text-b-4 text-gray uppercase tracking-wider">
              <div>TOKEN NAME</div>
              <div>PRICE</div>
              <div className="text-right">BALANCE</div>
            </div>

            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Spinner className="size-8" />
              </div>
            ) : query.isError ? null : tokens && tokens.length > 0 ? (
              <ScrollArea className="h-[400px]">
                {tokens.map((token) => (
                  <div
                    key={token.mint}
                    className="grid grid-cols-[2fr_1fr_1fr] items-center border-border/40 border-b px-5 py-3.5 transition-colors last:border-none hover:bg-white/2"
                  >
                    {/* Token */}
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {(token.symbol ?? token.mint).slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-semibold text-b-3 text-white leading-tight">
                          {token.symbol ?? token.mint}
                        </p>
                        {/* TODO: portfolio API exposes no per-token 24h change */}
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="font-semibold text-b-3 text-white leading-tight">
                        {formatCompactCurrency(token.current_price_usd)}
                      </p>
                      <p className="mt-0.5 font-semibold text-b-5 text-gray leading-tight">
                        -
                      </p>
                    </div>

                    {/* Balance */}
                    <div className="text-right">
                      <p className="font-semibold text-b-3 text-white leading-tight">
                        {token.current_price_usd == null
                          ? "-"
                          : formatCompactCurrency(
                              token.remaining * token.current_price_usd,
                            )}
                      </p>
                      <p className="mt-0.5 text-b-5 text-gray leading-tight">
                        {formatTokenAmount(token.remaining)}{" "}
                        {token.symbol ?? token.mint}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-b-4 text-muted-foreground">
                  No tokens in your portfolio.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
