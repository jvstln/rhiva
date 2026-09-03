"use client";

import { useState } from "react";
import type { TokenFull } from "@rhivadotfun/dataapi";
import { ChevronDown, Repeat, Settings, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import { SettingsDialog } from "../../settings/components/SettingsDialog";
import { PresetToggle } from "@/features/market/components/ToolbarItems";
import { getTokenWindowStats } from "../market.schema";
import { useTokenPrice } from "../market.hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../../../components/ui/input-group";
import { toast } from "sonner";
import { useSwap } from "@/features/transaction/hooks/use-swap";

const QUICK_AMOUNTS = ["0.01", "0.1", "0.5", "1"] as const;

export function TokenDetailTradePanel({ token }: { token: TokenFull }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const swap = useSwap();
  const priceQuery = useTokenPrice(token.mint);
  const livePriceUsd = priceQuery.data?.price_usd ?? token.price_usd;
  const livePriceNative = priceQuery.data?.price_native;

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-sm">
        <span className="text-muted-foreground">{token.name}</span>
        <span className="font-medium text-white">
          {token.symbol}
          (ATH MC {formatCompactCurrency(token.ath_mcap_usd)})
        </span>
      </div>

      {/* <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-1">
        <span className="flex items-center gap-1.5 font-medium text-b-3 text-white">
          <XIcon />
          Connection
        </span>
        <span className="font-semibold text-b-3 text-white">
          {token}
        </span>
      </div> */}

      <div className="flex items-center justify-between">
        <PresetToggle />

        <SettingsDialog defaultTab="trading-settings">
          <Button
            size={"icon"}
            variant={"ghost"}
          >
            <Settings />
          </Button>
        </SettingsDialog>
      </div>

      <Tabs
        value={side}
        onValueChange={(v) => setSide(v as typeof side)}
      >
        <TabsList
          variant={"soft"}
          className={"w-full"}
        >
          {(["Buy", "Sell"] as const).map((s) => (
            <TabsTrigger
              key={s}
              value={s.toLowerCase()}
              className={cn(s === "Sell" && "data-active:bg-sell/20")}
            >
              {s}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex items-center justify-end text-b-4 text-gray">
          Price:{" "}
          {livePriceNative != null
            ? `${formatCompactNumber(livePriceNative)} SOL`
            : formatCompactCurrency(livePriceUsd)}
        </div>

        <div>
          <InputGroup className="rounded-md rounded-b-none">
            <InputGroupInput
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{side === "buy" ? "SOL" : "%"}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div className="grid grid-cols-4">
            {QUICK_AMOUNTS.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt)}
                className="rounded-none first:rounded-bl-md last:rounded-br-md"
              >
                {amt}
                {side === "sell" && "%"}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-b-5 text-gray">
          Price USD: {formatCompactCurrency(livePriceUsd)}
        </p>

        <TabsContent value="buy">
          <Button
            className="w-full"
            data-require-auth
            loading={swap.isPending && swap.variables.action === "buy"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (Number(amount) <= 0) {
                return toast.error(
                  "Quick buy amount must be greater than zero",
                );
              }

              swap.mutate({
                action: "buy",
                outputMint: token.mint,
                amount: Number(amount),
              });
            }}
          >
            Buy
          </Button>
        </TabsContent>
        <TabsContent value="sell">
          <Button
            className="w-full"
            variant={"sell"}
            data-require-auth
            loading={swap.isPending && swap.variables.action === "sell"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (Number(amount) <= 0) {
                return toast.error(
                  "Quick sell amount must be greater than zero",
                );
              }

              swap.mutate(
                {
                  action: "sell",
                  inputMint: token.mint,
                  inputDecimals: token.decimals,
                  amount: Number(amount),
                },
                {
                  onSettled() {
                    console.log(swap.variables);
                  },
                },
              );
            }}
          >
            Sell
          </Button>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between text-b-5 text-gray">
        <span className="flex items-center gap-1">
          <Zap className="size-3" /> Auto
        </span>
        <span>
          {getTokenWindowStats(token, "24h")?.price_change_pct != null
            ? `${getTokenWindowStats(token, "24h")?.price_change_pct.toFixed(2)}%`
            : "--"}
        </span>
        <span className="flex items-center gap-1">
          <Repeat className="size-3" />
          {livePriceNative != null
            ? `${formatCompactNumber(livePriceNative)} SOL`
            : "<0.01 SOL"}
        </span>
        <ChevronDown className="size-3" />
      </div>
    </div>
  );
}
