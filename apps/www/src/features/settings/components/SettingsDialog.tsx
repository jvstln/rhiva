"use client";

import { Info } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useSettingsStore } from "../settings.store";
import type { SlippagePreset } from "../settings.type";
import { Field, FieldLabel } from "@/components/ui/field";

/* ------------------------------------------------------------------ */
/* Shared types                                                         */
/* ------------------------------------------------------------------ */

type SettingsTabId =
  | "transaction"
  | "dlmm"
  | "zap-in"
  | "trading-settings"
  | "others";

const SETTINGS_TABS: { id: SettingsTabId; label: string }[] = [
  { id: "transaction", label: "Transaction" },
  { id: "dlmm", label: "DLMM" },
  { id: "zap-in", label: "Zap In" },
  { id: "trading-settings", label: "Trading Settings" },
  { id: "others", label: "Others" },
];

/* ------------------------------------------------------------------ */
/* Shared building blocks                                               */
/* ------------------------------------------------------------------ */

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  tone?: "solid" | "soft" | "neutral";
  className?: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  tone = "solid",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg bg-surface-2 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2.5 font-medium text-sm transition-colors",
              !isActive && "text-muted-foreground hover:text-foreground",
              isActive &&
                tone === "solid" &&
                "bg-primary text-primary-foreground",
              isActive && tone === "soft" && "bg-primary/15 text-primary",
              isActive && tone === "neutral" && "bg-surface-3 text-foreground",
            )}
          >
            {Icon && <Icon className="size-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface ValueInputRowProps {
  label?: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  suffix?: React.ReactNode;
  className?: string;
}

function ValueInputRow({
  label,
  placeholder,
  defaultValue,
  value: controlledValue,
  onChange,
  suffix,
  className,
}: ValueInputRowProps) {
  const [localValue, setLocalValue] = useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) setLocalValue(val);
    onChange?.(val);
  };

  return (
    <div className={className}>
      {label && (
        <p className="mb-2 font-semibold text-foreground text-sm">{label}</p>
      )}
      <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-3">
        <span className="shrink-0 text-muted-foreground">{placeholder}</span>
        <input
          value={value}
          onChange={handleChange}
          className="w-full bg-transparent text-right font-medium text-foreground outline-none"
        />
        {suffix}
      </div>
    </div>
  );
}

function TextInputRow({
  defaultValue,
  value: controlledValue,
  onChange,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) setLocalValue(val);
    onChange?.(val);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      className={cn(
        "w-full rounded-lg border border-border bg-transparent px-4 py-3 text-muted-foreground outline-none focus:text-foreground",
        className,
      )}
    />
  );
}

function SectionDivider() {
  return <div className="border-border border-t" />;
}

/** Small stand-in for a token/quote-token glyph (three tinted bars). */
function TokenGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-end gap-0.5", className)}>
      <span className="h-2.5 w-1 rounded-full bg-info" />
      <span className="h-3.5 w-1 rounded-full bg-primary" />
      <span className="h-2 w-1 rounded-full bg-casablanca" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Transaction                                                      */
/* ------------------------------------------------------------------ */

function TransactionTab() {
  const { broadcastMode, priorityLevel, rebalancingType } = useSettingsStore(
    (state) => state.transaction,
  );
  const setTransactionSettings = useSettingsStore(
    (state) => state.setTransactionSettings,
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-muted-foreground text-sm">
          Transaction Broadcasting
        </p>
        <SegmentedControl
          value={broadcastMode}
          onChange={(val) => setTransactionSettings({ broadcastMode: val })}
          options={[
            { value: "priority-fee", label: "Priority Fee" },
            { value: "jito-only", label: "Jito Only" },
            { value: "mixed", label: "Mixed" },
          ]}
        />
        <p className="mt-3 text-muted-foreground text-sm">
          Rhiva submits your transaction through Jito Bundle only
        </p>
      </div>

      <SectionDivider />

      <div>
        <p className="mb-3 text-muted-foreground text-sm">Priority Level</p>
        <SegmentedControl
          value={priorityLevel}
          onChange={(val) => setTransactionSettings({ priorityLevel: val })}
          options={[
            { value: "fast", label: "Fast" },
            { value: "turbo", label: "Turbo" },
            { value: "ultra", label: "Ultra" },
          ]}
        />
      </div>

      <SectionDivider />

      <div className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3.5">
        <span className="text-foreground">Rebalancing type</span>
        <div className="flex items-center gap-4">
          {(
            [
              { value: "swap", label: "Swap" },
              { value: "swapless", label: "Swapless" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setTransactionSettings({ rebalancingType: option.value })
              }
              className="flex items-center gap-2 text-sm"
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full border-2",
                  rebalancingType === option.value
                    ? "border-primary"
                    : "border-muted-foreground/40",
                )}
              >
                {rebalancingType === option.value && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </span>
              <span
                className={
                  rebalancingType === option.value
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: DLMM                                                            */
/* ------------------------------------------------------------------ */

function SlippagePresetField({
  label,
  preset,
  onPresetChange,
  customValue,
  onCustomValueChange,
}: {
  label: string;
  preset: SlippagePreset;
  onPresetChange: (preset: SlippagePreset) => void;
  customValue: string;
  onCustomValueChange: (val: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 font-semibold text-foreground text-sm">{label}</p>
      <SegmentedControl
        tone="neutral"
        value={preset}
        onChange={onPresetChange}
        options={[
          { value: "0.1", label: "0.1%" },
          { value: "0.5", label: "0.5%" },
          { value: "1", label: "1%" },
          { value: "custom", label: "Custom" },
        ]}
      />
      <ValueInputRow
        className="mt-3"
        placeholder="Value"
        value={customValue}
        onChange={onCustomValueChange}
      />
    </div>
  );
}

function DlmmTab() {
  const dlmm = useSettingsStore((state) => state.dlmm);
  const setDlmmSettings = useSettingsStore((state) => state.setDlmmSettings);

  return (
    <div className="space-y-6">
      <SlippagePresetField
        label="Liquidity Spillage"
        preset={dlmm.liquiditySlippagePreset}
        onPresetChange={(val) =>
          setDlmmSettings({ liquiditySlippagePreset: val })
        }
        customValue={dlmm.liquiditySlippageCustom}
        onCustomValueChange={(val) =>
          setDlmmSettings({ liquiditySlippageCustom: val })
        }
      />
      <SlippagePresetField
        label="Swap Slippage"
        preset={dlmm.swapSlippagePreset}
        onPresetChange={(val) => setDlmmSettings({ swapSlippagePreset: val })}
        customValue={dlmm.swapSlippageCustom}
        onCustomValueChange={(val) =>
          setDlmmSettings({ swapSlippageCustom: val })
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Zap In                                                          */
/* ------------------------------------------------------------------ */

function ZapInTab() {
  const zapIn = useSettingsStore((state) => state.zapIn);
  const setZapInSettings = useSettingsStore((state) => state.setZapInSettings);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-primary/10 p-4">
        <div className="flex items-center gap-2 text-primary">
          <Info className="size-4" />
          <p className="font-semibold">What is Zap In?</p>
        </div>
        <p className="mt-2 text-muted-foreground text-sm">
          Create a liquidity position instantly with one token and one
          click—using your preferred settings.
        </p>
      </div>

      <ValueInputRow
        label="Amount"
        placeholder="Zap in amount"
        value={zapIn.amount}
        onChange={(val) => setZapInSettings({ amount: val })}
        suffix={<TokenGlyph />}
      />

      <div>
        <p className="mb-2 font-semibold text-foreground text-sm">Slippage</p>
        <div className="space-y-3">
          <ValueInputRow
            placeholder="Liquidity Slippage"
            value={zapIn.liquiditySlippage}
            onChange={(val) => setZapInSettings({ liquiditySlippage: val })}
          />
          <ValueInputRow
            placeholder="Swap Slippage"
            value={zapIn.swapSlippage}
            onChange={(val) => setZapInSettings({ swapSlippage: val })}
          />
        </div>
      </div>

      <ValueInputRow
        label="Swap Price Impact"
        placeholder="Max Price Impact"
        value={zapIn.swapPriceImpact}
        onChange={(val) => setZapInSettings({ swapPriceImpact: val })}
      />

      <SegmentedControl
        tone="soft"
        value={zapIn.curveType}
        onChange={(val) => setZapInSettings({ curveType: val })}
        options={[
          { value: "spot", label: "Spot" },
          { value: "curve", label: "Curve" },
          { value: "bid-ask", label: "Bid Ask" },
        ]}
      />

      <div className="flex items-center justify-end gap-2 rounded-lg border border-border px-4 py-3">
        <span className="size-3 rounded-sm bg-primary" />
        <span className="text-foreground text-sm">{zapIn.quoteToken}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Trading Settings                                                */
/* ------------------------------------------------------------------ */

function TradingSettingsTab() {
  const trading = useSettingsStore((state) => state.trading);
  const setTradingSettings = useSettingsStore(
    (state) => state.setTradingSettings,
  );
  const updateTradingConfig = useSettingsStore(
    (state) => state.updateTradingConfig,
  );

  const activeConfig = trading.presets[trading.activePreset]?.[
    trading.activeBuySellMode
  ] ?? {
    slippage: "20%",
    priority: "0.001",
    bribe: "0.01",
    autoFee: false,
    maxFee: "0.01",
    rpc: "RPC https://a...e.com",
  };

  return (
    <div className="space-y-6">
      <SegmentedControl
        tone="soft"
        value={trading.activePreset}
        onChange={(preset) => setTradingSettings({ activePreset: preset })}
        options={[
          { value: "preset-1", label: "Preset 1" },
          { value: "preset-2", label: "Preset 2" },
          { value: "preset-3", label: "Preset 3" },
        ]}
      />

      <SegmentedControl
        tone="soft"
        value={trading.activeBuySellMode}
        onChange={(mode) => setTradingSettings({ activeBuySellMode: mode })}
        options={[
          { value: "buy", label: "Buy Settings" },
          { value: "sell", label: "Sell Settings" },
        ]}
      />

      <ValueInputRow
        label="Slippage"
        placeholder="value"
        value={activeConfig.slippage}
        onChange={(val) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            slippage: val,
          })
        }
      />
      <ValueInputRow
        label="Priority"
        placeholder="value"
        value={activeConfig.priority}
        onChange={(val) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            priority: val,
          })
        }
      />
      <ValueInputRow
        label="Bribe"
        placeholder="value"
        value={activeConfig.bribe}
        onChange={(val) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            bribe: val,
          })
        }
      />

      <div className="flex items-center gap-3">
        <Field orientation="horizontal" className="w-fit">
          <Checkbox
            checked={activeConfig.autoFee}
            onCheckedChange={(checked) =>
              updateTradingConfig(
                trading.activePreset,
                trading.activeBuySellMode,
                { autoFee: checked === true },
              )
            }
          />
          <FieldLabel>Auto Fee</FieldLabel>
        </Field>
        <ValueInputRow
          className="flex-1"
          placeholder="Max Fee"
          value={activeConfig.maxFee}
          onChange={(val) =>
            updateTradingConfig(
              trading.activePreset,
              trading.activeBuySellMode,
              { maxFee: val },
            )
          }
        />
      </div>

      <TextInputRow
        value={activeConfig.rpc}
        onChange={(val) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            rpc: val,
          })
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Others                                                          */
/* ------------------------------------------------------------------ */

function OthersTab() {
  const notifications = useSettingsStore((state) => state.notifications);
  const toggleNotification = useSettingsStore(
    (state) => state.toggleNotification,
  );

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">Message Notifications</p>
      <div className="space-y-5">
        {notifications.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <span className="text-foreground">{setting.label}</span>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => toggleNotification(setting.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog shell                                                         */
/* ------------------------------------------------------------------ */

type SettingsDialogProps = React.ComponentProps<typeof Dialog> & {
  defaultTab?: SettingsTabId;
  children?: React.ReactElement;
};

export function SettingsDialog({
  open,
  onOpenChange,
  defaultTab = "transaction",
  children,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(defaultTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="flex h-[85vh] w-full flex-col sm:max-w-xl">
        <Tabs className={"h-full min-h-0"}>
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">Settings</DialogTitle>
            <TabsList variant={"line"}>
              {SETTINGS_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab}
                  onClick={() => setActiveTab(tab.id)}
                  data-active={activeTab === tab.id ? true : undefined}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </DialogHeader>

          <ScrollArea
            className={"-mx-(--padding-x) h-full min-h-0 px-(--padding-x)"}
          >
            <div>
              {activeTab === "transaction" && <TransactionTab />}
              {activeTab === "dlmm" && <DlmmTab />}
              {activeTab === "zap-in" && <ZapInTab />}
              {activeTab === "trading-settings" && <TradingSettingsTab />}
              {activeTab === "others" && <OthersTab />}
            </div>
            <ScrollBar showScrollBar />
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
