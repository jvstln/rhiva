"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { PortfolioPnl } from "../portfolio.type";

import { useAuth } from "@/hooks";
import { TokenDialog } from "./TokenDialog";
import { cn, currencies } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatCompactCurrency } from "@/lib/finance.util";
import { SwapDialog } from "../../transaction/components/SwapDialog";
import { SendDialog } from "../../transaction/components/SendDialog";
import { DepositDialog } from "../../transaction/components/DepositDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PortfolioHeroProps = {
  query: UseQueryResult<PortfolioPnl, Error>;
};

export function PortfolioHero({ query }: PortfolioHeroProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const auth = useAuth();

  const totalValue = formatCompactCurrency(
    query.data?.summary?.total_value_usd ?? query.data?.total_usd,
  ).slice(1);
  const isLoading = query.isPending && query.fetchStatus !== "paused";

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col items-center overflow-hidden rounded-3xl border px-4 py-10 text-center sm:px-6 sm:py-14",
        "border-white/5 bg-background/8 backdrop-blur-lg",
      )}
      style={{
        boxShadow: `0 4px 32px rgba(255, 255, 255, 0.08), inset 1px 1px 0 rgba(255, 255, 255, 0.6)`,
        backgroundImage:
          "radial-gradient(60% 90% at 50% 100%, color-mix(in oklch, var(--foreground) 8%, transparent), transparent), linear-gradient(180deg, var(--surface-1), var(--background))",
      }}
    >
      <p className="flex items-center gap-1.5 text-b-2 text-gray">
        Est. total value&nbsp;
        <Button
          variant={"ghost"}
          size="icon-sm"
          onClick={() => setBalanceHidden((bh) => !bh)}
        >
          {balanceHidden ? <EyeOff /> : <Eye />}
        </Button>
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="flex items-center gap-1 font-bold text-h2 text-white">
          {selectedCurrency.symbol.length === 1 ? selectedCurrency.symbol : ""}
          {balanceHidden ? (
            "••••"
          ) : isLoading ? (
            <Spinner className="size-8" />
          ) : (
            totalValue
          )}
          {selectedCurrency.symbol.length > 1
            ? ` ${selectedCurrency.symbol}`
            : ""}
        </span>
        <Select
          value={currencies[0]}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedCurrency(value);
          }}
          itemToStringLabel={(item) => item.value}
        >
          <SelectTrigger className={"w-fit border-none"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem
                key={curr.value}
                value={curr}
              >
                {curr.label} ({curr.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {query.isError ? (
        <Button
          variant={"ghost"}
          onClick={() => query.refetch()}
          size="sm"
          className="[--accent:var(--color-destructive)]"
        >
          <RefreshCw
            className={cn("size-3.5", query.isRefetching && "animate-spin")}
          />
          {query.isRefetching ? "Retrying…" : "Failed to load balance — retry"}
        </Button>
      ) : null}

      <div className="mt-6 flex w-full min-w-0 max-w-xs items-center justify-center gap-3">
        <Tooltip>
          {({ payload }: { payload?: string }) => (
            <>
              <TokenDialog query={query}>
                <TooltipTrigger
                  payload={"View tokens"}
                  render={
                    <Button
                      className="grow"
                      variant="outline"
                      data-require-auth
                    />
                  }
                >
                  Token
                </TooltipTrigger>
              </TokenDialog>

              <SwapDialog>
                <TooltipTrigger
                  payload={"Swap"}
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      data-require-auth
                    />
                  }
                >
                  <ArrowDownUp />
                </TooltipTrigger>
              </SwapDialog>

              {auth.authenticated && (
                <SendDialog activeWallet={auth.activeWallet}>
                  <TooltipTrigger
                    payload={"Send"}
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        data-require-auth
                      />
                    }
                  >
                    <ArrowUp />
                  </TooltipTrigger>
                </SendDialog>
              )}

              {auth.authenticated && (
                <DepositDialog address={auth.activeWallet.address}>
                  <TooltipTrigger
                    payload={"Receive"}
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        data-require-auth
                      />
                    }
                  >
                    <ArrowDown />
                  </TooltipTrigger>
                </DepositDialog>
              )}

              <TooltipContent>{payload}</TooltipContent>
            </>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
