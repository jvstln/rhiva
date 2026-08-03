"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  getBinsInRange,
  getPoolTokens,
  getTokenBalance,
} from "../liquidity.util";
import { MeteoraTrade, type MeteoraTradeInput } from "../liquidity.schema";
import { BarGraph } from "./BarGraph";
import { SideRailRow } from "@/components/ui/side-rail";

export function MeteoraTradeRail({ pool }: { pool: LiquidityPool }) {
  const { base, quote } = getPoolTokens(pool);

  const { data: balances } = usePoolTokenBalances(pool);
  const [activeToken, setActiveToken] = useState<"base" | "quote">("base");

  const token = activeToken === "base" ? base : quote;
  const balance = getTokenBalance(balances, token.mint);

  const form = useForm<MeteoraTradeInput, unknown, MeteoraTrade>({
    resolver: zodResolver(MeteoraTrade),
    defaultValues: {
      type: "spot",
      amount: "",
      side: "full-sided",
      ratio: 50,
      minPrice: "0",
      maxPrice: "0",
      bins: getBinsInRange(pool, 0, 0),
    },
  });

  const type = form.watch("type");
  const side = form.watch("side");
  const ratio = form.watch("ratio");
  const minPrice = form.watch("minPrice");
  const maxPrice = form.watch("maxPrice");
  const bins = form.watch("bins");

  useEffect(() => {
    if (side === "single-sided") form.setValue("ratio", 100);
  }, [side, form]);

  useEffect(() => {
    form.setValue(
      "bins",
      getBinsInRange(pool, Number(minPrice), Number(maxPrice)),
    );
  }, [pool, minPrice, maxPrice, form]);

  return (
    <aside>
      <Tabs
        className="space-y-4 p-4"
        value={type}
        onValueChange={(v) => form.setValue("type", v)}
      >
        <TabsList
          className="w-full"
          variant={"line"}
        >
          {MeteoraTrade.shape.type.options.map((option) => (
            <TabsTrigger
              key={option}
              value={option}
            >
              {capitalize(option)}
            </TabsTrigger>
          ))}
        </TabsList>

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldContent className="flex flex-row justify-between">
                <FieldLabel>Trade amount</FieldLabel>
                <ToggleGroup size={"xs"}>
                  {MeteoraTrade.shape.side.options.map((s) => (
                    <ToggleGroupItem
                      key={s}
                      pressed={s === side}
                      onPressedChange={(pressed) => {
                        if (!pressed) return;
                        form.setValue("side", s);
                      }}
                    >
                      {capitalize(s)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
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

        <FieldGroup>
          <div className="grid grid-cols-2 gap-2">
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

          <Field>
            <FieldLabel>Liquidity Ratio %</FieldLabel>
            <Slider
              disabled={side === "single-sided"}
              value={[ratio]}
              onValueChange={(v) =>
                form.setValue("ratio", Array.isArray(v) ? (v[0] ?? ratio) : v)
              }
              max={100}
              step={1}
            />
            <FieldDescription className="flex w-full justify-between gap-2">
              <span>
                {ratio}% {base.symbol}
              </span>
              <span>
                {100 - ratio}% {quote.symbol}
              </span>
            </FieldDescription>
          </Field>

          <ToggleGroup size="xs">
            {[50, 75, 40].map((pct) => (
              <ToggleGroupItem
                key={pct}
                disabled={side === "single-sided"}
                onPressedChange={(pressed) => {
                  if (!pressed) return;
                  form.setValue("ratio", pct);
                }}
                pressed={ratio === pct}
              >
                {pct}:{100 - pct}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldGroup>

        <BarGraph
          data={
            type === "curve"
              ? Array.from({ length: 100 }, (_, i) => ({
                  value: 1 - Math.abs(i - 50) / 50,
                }))
              : type === "bid-ask"
                ? Array.from({ length: 100 }, (_, i) => ({
                    value: i === 50 ? 1 : Math.abs(i - 50) / 50,
                  }))
                : Array.from({ length: 100 }, () => ({ value: 1 }))
          }
          markerIndex={50}
        />
      </Tabs>

      <div className="space-y-4 border-border/70 border-t p-4">
        <div className="flex items-center gap-2">
          <ToggleGroup size="xs">
            {[1, 5, 10].map((preset) => (
              <ToggleGroupItem key={preset}>±{preset}%</ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="ml-auto flex items-center gap-2 rounded-md border border-border/70 px-3 py-1.5">
            <span className="text-b-4 text-gray">Bins</span>
            <span className="font-semibold text-b-4 text-white">{bins}</span>
          </div>
        </div>

        <FieldGroup className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel className="text-xs">Min price</FieldLabel>
            <InputGroup size="sm">
              <InputGroupInput inputMode="decimal" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{0.3}%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel className="text-xs">Max price</FieldLabel>
            <InputGroup size="sm">
              <InputGroupInput inputMode="decimal" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{0.3}%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>

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
          <Button className="w-full">Open Position</Button>
        </div>
      </div>
    </aside>
  );
}
