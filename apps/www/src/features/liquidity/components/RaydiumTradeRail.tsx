"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { RaydiumTrade, type RaydiumTradeInput } from "../liquidity.schema";
import { LiquidityDepthChart } from "./detail/LiquidityDepthChart";
import { SideRailRow } from "@/components/ui/side-rail";

const PRICE_PRESETS = ["± 1%", "± 5%", "± 10%", "Custom"] as const;

const parsePreset = (label: string): number | null => {
  if (label === "Custom") return null;
  return Number(label.replace(/[^0-9.]/g, "")) / 100;
};

export function RaydiumTradeRail({ pool }: { pool: LiquidityPool }) {
  const { base, quote } = getPoolTokens(pool);
  const price = getPoolPriceInQuote(pool);
  const { data: balances } = usePoolTokenBalances(pool);

  const [activeToken, setActiveToken] = useState<"base" | "quote">("base");
  const token = activeToken === "base" ? base : quote;
  const balance = getTokenBalance(balances, token.mint);

  const dex = "raydium-clmm" as const;
  const zapInState = useSettingsStore((state) => state.zapIn);
  const setZapInSettings = useSettingsStore((state) => state.setZapInSettings);
  const zapIn = useZapIn({ pool: pool.pool_address, dex });

  const handleSubmit = (values: RaydiumTrade) => {
    const changes = getPriceChangesFromCurrentPrice(
      price ?? 0,
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

  const basePct = pool.tvl_distribution?.base_pct ?? 50;
  const quotePct = pool.tvl_distribution?.quote_pct ?? 50;

  const form = useForm<RaydiumTradeInput, unknown, RaydiumTrade>({
    resolver: zodResolver(RaydiumTrade),
    defaultValues: {
      preset: "± 10%",
      minPrice: String((price ?? 0) * 0.9),
      maxPrice: String((price ?? 0) * 1.1),
      amount: "",
    },
  });

  const preset = form.watch("preset");
  const minPrice = form.watch("minPrice");
  const maxPrice = form.watch("maxPrice");

  const spread = parsePreset(preset);
  const current = price ?? 0;
  const computedMinPrice =
    spread != null ? current * (1 - spread) : Number(minPrice);
  const computedMaxPrice =
    spread != null ? current * (1 + spread) : Number(maxPrice);

  const minOffset =
    current > 0 && typeof computedMinPrice === "number" && computedMinPrice > 0
      ? `-${(((current - computedMinPrice) / current) * 100).toFixed(1)}%`
      : "—";
  const maxOffset =
    current > 0 && typeof computedMaxPrice === "number" && computedMaxPrice > 0
      ? `+${(((computedMaxPrice - current) / current) * 100).toFixed(1)}%`
      : "—";

  const applyPreset = (next: string) => {
    form.setValue("preset", next);
    if (next === "Custom") return;
    const spread = parsePreset(next)!;
    form.setValue("minPrice", String((current * (1 - spread)).toFixed(6)));
    form.setValue("maxPrice", String((current * (1 + spread)).toFixed(6)));
  };

  const onMinChange = (value: string) => {
    form.setValue("preset", "Custom");
    form.setValue("minPrice", value);
  };

  const onMaxChange = (value: string) => {
    form.setValue("preset", "Custom");
    form.setValue("maxPrice", value);
  };

  return (
    <aside>
      <Tabs
        className="space-y-4 p-4"
        value={preset}
        onValueChange={(v) => applyPreset(v)}
      >
        <TabsList
          className="w-full"
          variant={"line"}
        >
          {PRICE_PRESETS.map((p) => (
            <TabsTrigger
              key={p}
              value={p}
            >
              {p}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="fade-in animate-in space-y-6 duration-300">
          <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
            <span className="text-b-4 text-gray">Current Price</span>
            <span className="ml-auto font-semibold text-b-4 text-white">
              {formatPrice(price, 6)} {quote.symbol}
            </span>
          </div>

          <LiquidityDepthChart pool={pool} />

          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs">Min Price</FieldLabel>
              <div className="flex overflow-hidden rounded-xl border border-border/40 bg-secondary/30">
                <Controller
                  name="minPrice"
                  control={form.control}
                  render={({ field }) => (
                    <InputGroupInput
                      inputMode="decimal"
                      value={
                        preset === "Custom"
                          ? field.value
                          : formatPrice(computedMinPrice, 6)
                      }
                      onValueChange={(v) => {
                        field.onChange(v);
                        onMinChange(v);
                      }}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
                    />
                  )}
                />
                <div className="flex items-center whitespace-nowrap border-border/40 border-l bg-white/5 px-4 text-gray text-sm">
                  {minOffset}
                </div>
              </div>
            </Field>
            <Field>
              <FieldLabel className="text-xs">Max Price</FieldLabel>
              <div className="flex overflow-hidden rounded-xl border border-border/40 bg-secondary/30">
                <Controller
                  name="maxPrice"
                  control={form.control}
                  render={({ field }) => (
                    <InputGroupInput
                      inputMode="decimal"
                      value={
                        preset === "Custom"
                          ? field.value
                          : formatPrice(computedMaxPrice, 6)
                      }
                      onValueChange={(v) => {
                        field.onChange(v);
                        onMaxChange(v);
                      }}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
                    />
                  )}
                />
                <div className="flex items-center whitespace-nowrap border-border/40 border-l bg-white/5 px-4 text-gray text-sm">
                  {maxOffset}
                </div>
              </div>
            </Field>
          </FieldGroup>

          <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
            <span className="text-b-4 text-gray">Yield</span>
            <span className="ml-auto flex items-center gap-2">
              <span className="font-semibold text-b-4 text-white">
                {basePct}% {base.symbol}
              </span>
              <span className="font-semibold text-b-4 text-white">
                {quotePct}% {quote.symbol}
              </span>
            </span>
          </div>

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldContent className="flex flex-row justify-between">
                  <FieldLabel>Trade amount</FieldLabel>
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
        </div>
      </Tabs>

      <div className="space-y-4 border-border/70 border-t p-4">
        <div className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
          <span className="text-b-4 text-gray">Fees</span>
          <span className="ml-auto font-semibold text-b-4 text-white">
            0.30%
          </span>
        </div>

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
