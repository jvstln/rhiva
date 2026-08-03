"use client";

import { ArrowLeftRight, ChartSpline, CircleDot, Info } from "lucide-react";
import { Fragment } from "react";

import { capitalize } from "@/lib/utils";
import type { Strategy } from "@rhivadotfun/zap/dex/meteora";
import { useSettingsStore } from "../settings.store";
import type { BinRangeMode, SlippageMode } from "../settings.type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { SolanaIcon } from "@/components/ui/icons";
import {
  POOL_DEXES,
  type PoolDex,
} from "@/features/liquidity/liquidity.schema";
import { BarGraph } from "@/features/liquidity/components/BarGraph";

function toNumber(value: string) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function ZapInTab() {
  const zapIn = useSettingsStore((state) => state.zapIn);
  const { setDex, setCurveType, setSettings } = zapIn;

  const dex = zapIn.settings[zapIn.dex] ? zapIn.dex : "meteora-dlmm";
  const settings = zapIn.settings[dex];

  return (
    <div className="space-y-6">
      <Alert>
        <Info />
        <AlertTitle>What is Zap In?</AlertTitle>
        <AlertDescription>
          Create a liquidity position instantly with one token and one
          click—using your preferred settings.
        </AlertDescription>
      </Alert>

      <Field>
        <FieldLabel>Amount</FieldLabel>
        <InputGroup>
          <InputGroupInput
            inputMode="decimal"
            placeholder="0.0"
            value={settings.amount}
            onValueChange={(value) => setSettings({ amount: toNumber(value) })}
          />
          <InputGroupAddon align="inline-end">
            <SolanaIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-start">
            <InputGroupText>Zap in amount</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Tabs
        value={dex}
        onValueChange={(value) => setDex(value as PoolDex)}
      >
        <TabsList
          className="w-full"
          variant="line"
        >
          {Object.entries(POOL_DEXES).map(([value, { icon: Icon }]) => (
            <TabsTrigger
              key={value}
              value={value}
            >
              <Icon data-icon="inline-start" />
              {capitalize(value.split("-")[0])}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Field>
        <FieldContent className="flex flex-row justify-between">
          <FieldLabel>Liquidity slippage</FieldLabel>
          <ToggleGroup
            size="xs"
            value={[settings.liquiditySlippageMode]}
            onValueChange={([value]) => {
              if (!value) return;
              setSettings({
                liquiditySlippageMode: value as SlippageMode,
                ...(Number(value) && { liquiditySlippage: Number(value) }),
              });
            }}
          >
            {([0.1, 0.5, 1] as const).map((preset) => (
              <ToggleGroupItem
                key={preset}
                value={`${preset}`}
              >
                {preset}%
              </ToggleGroupItem>
            ))}
            <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
            <ToggleGroupItem value="dynamic">Dynamic</ToggleGroupItem>
          </ToggleGroup>
        </FieldContent>

        {settings.liquiditySlippageMode === "dynamic" ? (
          <Alert>
            <Info />
            <AlertTitle>Dynamic slippage</AlertTitle>

            <AlertDescription>
              Liquidity slippage will adapt instantly to market volatility to
              improve transaction success rates.
            </AlertDescription>
          </Alert>
        ) : (
          <InputGroup>
            <InputGroupInput
              inputMode="decimal"
              value={settings.liquiditySlippage}
              onValueChange={(value) =>
                setSettings({ liquiditySlippage: toNumber(value) })
              }
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        )}
      </Field>

      <Field>
        <FieldContent className="flex flex-row justify-between">
          <FieldLabel>Swap slippage</FieldLabel>
          <ToggleGroup
            size="xs"
            value={[settings.swapSlippageMode]}
            onValueChange={([value]) => {
              if (!value) return;
              setSettings({
                swapSlippageMode: value as SlippageMode,
                ...(Number(value) && { swapSlippage: Number(value) }),
              });
            }}
          >
            {([0.1, 0.5, 1] as const).map((preset) => (
              <ToggleGroupItem
                key={preset}
                value={`${preset}`}
              >
                {preset}%
              </ToggleGroupItem>
            ))}
            <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
          </ToggleGroup>
        </FieldContent>

        <InputGroup>
          <InputGroupInput
            inputMode="decimal"
            value={settings.swapSlippage}
            onValueChange={(value) =>
              setSettings({ swapSlippage: toNumber(value) })
            }
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>%</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {dex === "meteora-dlmm" && (
        <>
          <Field>
            <FieldContent className="flex flex-row justify-between">
              <FieldLabel>Strategy</FieldLabel>
              <ToggleGroup
                // size="xs"
                value={[zapIn.curveType]}
                onValueChange={([value]) => {
                  if (!value) return;
                  setCurveType(value as keyof typeof Strategy);
                }}
              >
                {(
                  [
                    { value: "Spot", label: "Spot", icon: CircleDot },
                    { value: "Curve", label: "Curve", icon: ChartSpline },
                    {
                      value: "BidAsk",
                      label: "Bid Ask",
                      icon: ArrowLeftRight,
                    },
                  ] as const
                ).map(({ value, label, icon: Icon }) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                  >
                    <Icon />
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FieldContent>
          </Field>

          <BarGraph
            markerIndex={50}
            data={
              zapIn.curveType === "Curve"
                ? Array.from({ length: 100 }, (_, i) => ({
                    value: 1 - Math.abs(i - 50) / 50,
                  }))
                : zapIn.curveType === "BidAsk"
                  ? Array.from({ length: 100 }, (_, i) => ({
                      value: i === 50 ? 1 : Math.abs(i - 50) / 50,
                    }))
                  : Array.from({ length: 100 }, () => ({ value: 1 }))
            }
          />
        </>
      )}

      <Field>
        <FieldLabel>Bin range mode</FieldLabel>
        <RadioGroup
          className="flex flex-row gap-2"
          value={settings.binRangeMode}
          onValueChange={(value) =>
            setSettings({ binRangeMode: value as BinRangeMode })
          }
        >
          {(
            [
              { value: "custom", label: "Custom" },
              { value: "quote", label: "Quote Only" },
              { value: "base", label: "Base Only" },
            ] as const
          ).map(({ value, label }) => (
            <Fragment key={value}>
              {/** biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem renders a hidden input, so the label is associated at runtime */}
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value={value} />
                <span className="text-foreground text-sm">{label}</span>
              </label>
            </Fragment>
          ))}
        </RadioGroup>
      </Field>

      <Field>
        <FieldLabel>Bin range from current price</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <InputGroup>
            <InputGroupInput
              inputMode="numeric"
              value={settings.rangeFromCurrentPrice[0]}
              onValueChange={(value) =>
                setSettings({
                  rangeFromCurrentPrice: [
                    toNumber(value),
                    settings.rangeFromCurrentPrice[1],
                  ],
                })
              }
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>Lower</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput
              inputMode="numeric"
              value={settings.rangeFromCurrentPrice[1]}
              onValueChange={(value) =>
                setSettings({
                  rangeFromCurrentPrice: [
                    settings.rangeFromCurrentPrice[0],
                    toNumber(value),
                  ],
                })
              }
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>Higher</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Field>
    </div>
  );
}
