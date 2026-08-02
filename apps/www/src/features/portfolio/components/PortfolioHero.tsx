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

import { useAuth } from "@/hooks";
import { TokenDialog } from "./TokenDialog";
import { cn, currencies } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  totalValue?: string;
  isError?: boolean;
  isRetrying?: boolean;
  onRetry?: () => void;
};

export function PortfolioHero({
  totalValue,
  isError,
  isRetrying,
  onRetry,
}: PortfolioHeroProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const auth = useAuth();

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col items-center overflow-hidden rounded-3xl border px-6 py-14 text-center",
        "border-white/5 bg-background/8 backdrop-blur-lg",
      )}
      style={{
        boxShadow: `0 4px 32px rgba(255, 255, 255, 0.08), inset 1px 1px 0 rgba(255, 255, 255, 0.6)`,
        backgroundImage:
          "radial-gradient(60% 90% at 50% 100%, color-mix(in oklch, var(--foreground) 8%, transparent), transparent), linear-gradient(180deg, var(--surface-1), var(--background))",
      }}
    >
      <p className="flex items-center gap-1.5 text-b-2 text-gray">
        Est. total value{" "}
        <Button
          variant={"ghost"}
          size="icon-sm"
          onClick={() => setBalanceHidden((bh) => !bh)}
        >
          {balanceHidden ? <EyeOff /> : <Eye />}
        </Button>
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-bold text-h2 text-white">
          {selectedCurrency.symbol.length === 1 ? selectedCurrency.symbol : ""}
          {balanceHidden ? "••••" : totalValue}
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

      {isError ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 flex items-center gap-1.5 font-medium text-b-3 text-destructive hover:underline"
        >
          <RefreshCw className={cn("size-3.5", isRetrying && "animate-spin")} />
          {isRetrying ? "Retrying…" : "Failed to load balance — retry"}
        </button>
      ) : null}

      <div className="mt-6 flex min-w-xs items-center justify-center gap-3">
        <Tooltip>
          {({ payload }: { payload?: string }) => (
            <>
              <TokenDialog>
                <TooltipTrigger
                  payload={"View tokens"}
                  render={
                    <Button
                      className="grow"
                      variant="outline"
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
                    />
                  }
                >
                  <ArrowDownUp />
                </TooltipTrigger>
              </SwapDialog>

              {auth.authenticated ? (
                <SendDialog activeWallet={auth.activeWallet}>
                  <TooltipTrigger
                    payload={"Send"}
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                      />
                    }
                  >
                    <ArrowUp />
                  </TooltipTrigger>
                </SendDialog>
              ) : (
                <TooltipTrigger
                  payload={"Send"}
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      disabled
                    />
                  }
                >
                  <ArrowUp />
                </TooltipTrigger>
              )}

              <DepositDialog address={"Wallet address"}>
                <TooltipTrigger
                  payload={"Receive"}
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                    />
                  }
                >
                  <ArrowDown />
                </TooltipTrigger>
              </DepositDialog>

              <TooltipContent>{payload}</TooltipContent>
            </>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
