"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { capitalize } from "@/lib/utils";
import { useZapIn } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/features/settings/settings.store";
import type { ZapInDexSettings } from "@/features/settings/settings.type";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { LiquidityPool } from "../liquidity.type";
import { usePoolTokenBalances } from "../liquidity.hook";
import {
  formatBalance,
  formatPrice,
  getPoolPriceInQuote,
  getPoolTokens,
  getPriceChangesFromCurrentPrice,
  getTokenBalance,
} from "../liquidity.util";
import { OrcaTrade, type OrcaTradeInput } from "../liquidity.schema";
import { LiquidityDepthChart } from "./detail/trade-rail-shared";
import { SideRailRow } from "@/components/ui/side-rail";

export function OrcaTradeRail({ pool }: { pool: LiquidityPool }) {
  const { base, quote } = getPoolTokens(pool);
  const priceInQuote = getPoolPriceInQuote(pool) ?? 0;
  const { data: balances } = usePoolTokenBalances(pool);

  const [activeToken, setActiveToken] = useState<"base" | "quote">("base");
  const token = activeToken === "base" ? base : quote;
  const balance = getTokenBalance(balances, token.mint);

  const dex = "orca-whirlpool" as const;
  const zapInState = useSettingsStore((state) => state.zapIn);
  const setZapInSettings = useSettingsStore((state) => state.setZapInSettings);
  const zapIn = useZapIn({ pool: pool.pool_address, dex });

  const handleSubmit = (values: OrcaTrade) => {
    const changes = getPriceChangesFromCurrentPrice(
      priceInQuote,
      values.minPrice,
      values.maxPrice,
    );

    const settings: Partial<ZapInDexSettings> = {
      amount: values.amount,
      inputToken: {
        mint: token.mint ?? "",
        decimals: token.decimals ?? 9,
      },
    };
    if (changes) settings.priceChangesFromCurrentPrice = changes;

    setZapInSettings({
      dex,
      settings: {
        ...zapInState.settings,
        [dex]: { ...zapInState.settings[dex], ...settings },
      },
    });

    zapIn.mutate(undefined, {
      onSuccess(response) {
        toast.success(
          `Position opened! Bundle: ${response.bundleId.slice(0, 8)}...`,
        );
      },
      onError(error) {
        toast.error(error.message);
      },
    });
  };

  const form = useForm<OrcaTradeInput, unknown, OrcaTrade>({
    resolver: zodResolver(OrcaTrade),
    defaultValues: {
      tab: "full",
      tradeType: "full-sided",
      selectedCurrency: "base",
      amount: "",
      minPrice: String(priceInQuote * 0.95),
      maxPrice: String(priceInQuote * 1.05),
    },
  });

  const tab = form.watch("tab");
  const tradeType = form.watch("tradeType");
  const selectedCurrency = form.watch("selectedCurrency");
  const minPrice = form.watch("minPrice");
  const maxPrice = form.watch("maxPrice");

  const activePct =
    tradeType === "full-sided"
      ? (pool.tvl_distribution?.base_pct ?? 50)
      : selectedCurrency === "base"
        ? 100
        : 0;
  const quotePct =
    tradeType === "full-sided"
      ? (pool.tvl_distribution?.quote_pct ?? 50)
      : selectedCurrency === "base"
        ? 0
        : 100;

  useEffect(() => {
    if (tradeType === "single-sided") {
      form.setValue("selectedCurrency", activeToken);
    }
  }, [tradeType, activeToken, form]);

  return (
    <aside>
      <Tabs
        className="space-y-4 p-4"
        value={tab}
        onValueChange={(v) => form.setValue("tab", v as OrcaTradeInput["tab"])}
      >
        <TabsList
          className="w-full"
          variant={"line"}
        >
          {OrcaTrade.shape.tab.options.map((option) => (
            <TabsTrigger
              key={option}
              value={option}
            >
              {capitalize(option)}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="fade-in animate-in space-y-6 duration-300">
          {tab === "custom" && (
            <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
              <span className="text-b-4 text-gray">Current Price</span>
              <span className="ml-auto font-semibold text-b-4 text-white">
                {formatPrice(priceInQuote, 6)} {quote.symbol}
              </span>
            </div>
          )}

          {tab === "custom" && <LiquidityDepthChart pool={pool} />}

          {tab === "custom" && (
            <div className="flex items-center justify-between">
              <span className="text-b-4 text-gray">Trade type</span>
              <ToggleGroup
                size="sm"
                value={[tradeType]}
                onValueChange={([value]) => {
                  form.setValue(
                    "tradeType",
                    value as OrcaTradeInput["tradeType"],
                  );
                }}
                spacing={0}
              >
                <ToggleGroupItem value="full-sided">Full-sided</ToggleGroupItem>
                <ToggleGroupItem value="single-sided">
                  Single-sided
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldContent className="flex flex-row justify-between">
                  <FieldLabel>Trade amount</FieldLabel>
                  {tab === "custom" && (
                    <ToggleGroup
                      size="sm"
                      spacing={0}
                    >
                      <ToggleGroupItem
                        pressed={tradeType === "full-sided"}
                        onPressedChange={(pressed) => {
                          if (pressed) form.setValue("tradeType", "full-sided");
                        }}
                      >
                        Full
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        pressed={tradeType === "single-sided"}
                        onPressedChange={(pressed) => {
                          if (pressed)
                            form.setValue("tradeType", "single-sided");
                        }}
                      >
                        Single
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                </FieldContent>

                <InputGroup>
                  <InputGroupInput
                    inputMode="decimal"
                    placeholder="0.0"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{token.symbol}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <div className="flex items-center justify-between gap-2">
                  <FieldDescription>
                    Balance: {formatBalance(balance)} {token.symbol}
                  </FieldDescription>

                  <ToggleGroup size={"xs"}>
                    {[25, 50, 100].map((pct) => (
                      <ToggleGroupItem
                        key={pct}
                        onPressedChange={(pressed) => {
                          if (!pressed) return;
                          field.onChange(pct * balance);
                        }}
                        pressed={pct * balance === Number(field.value)}
                      >
                        {pct}%
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="flex gap-3 *:flex-1">
            <Button
              variant={activeToken === "base" ? "default" : "outline"}
              onClick={() => setActiveToken("base")}
            >
              {base.symbol}
            </Button>
            <Button
              variant={activeToken === "quote" ? "default" : "outline"}
              onClick={() => setActiveToken("quote")}
            >
              {quote.symbol}
            </Button>
          </div>

          {tab === "full" && (
            <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
              <span className="text-b-4 text-gray">Yield</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="font-semibold text-b-4 text-white">
                  {activePct}% {base.symbol}
                </span>
                <span className="font-semibold text-b-4 text-white">
                  {quotePct}% {quote.symbol}
                </span>
              </span>
            </div>
          )}

          {tab === "custom" && (
            <>
              <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
                <span className="text-b-4 text-gray">Yield</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="font-semibold text-b-4 text-white">
                    {activePct}% {base.symbol}
                  </span>
                  <span className="font-semibold text-b-4 text-white">
                    {quotePct}% {quote.symbol}
                  </span>
                </span>
              </div>

              <FieldGroup className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel className="text-xs">Min price</FieldLabel>
                  <InputGroup size="sm">
                    <InputGroupInput
                      inputMode="decimal"
                      value={minPrice}
                      onValueChange={(v) => form.setValue("minPrice", v)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>{quote.symbol}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Max price</FieldLabel>
                  <InputGroup size="sm">
                    <InputGroupInput
                      inputMode="decimal"
                      value={maxPrice}
                      onValueChange={(v) => form.setValue("maxPrice", v)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>{quote.symbol}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </>
          )}

          <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
            <span className="text-b-4 text-gray">Fees</span>
            <span className="ml-auto font-semibold text-b-4 text-white">
              0.30%
            </span>
          </div>
        </div>
      </Tabs>

      <div className="space-y-4 border-border/70 border-t p-4">
        <div>
          <SideRailRow
            label={"Non-Refundable Fees"}
            value={"<0.01 SOL"}
          />
          <SideRailRow
            label={"Refundable Fees"}
            value={"0.01 SOL"}
          />
        </div>

        <div className="sticky bottom-4 bg-background py-2">
          <Button
            className="w-full"
            data-require-auth
            loading={zapIn.isPending}
            onClick={form.handleSubmit(handleSubmit)}
          >
            Open Position
          </Button>
        </div>
      </div>
    </aside>
  );
}
