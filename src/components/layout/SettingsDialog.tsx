"use client";

import { BarChart2, BarChart3, Info, LineChart } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2.5 text-sm font-medium transition-colors",
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
  suffix?: React.ReactNode;
  className?: string;
}

function ValueInputRow({
  label,
  placeholder,
  defaultValue,
  suffix,
  className,
}: ValueInputRowProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div className={className}>
      {label && (
        <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      )}
      <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-3">
        <span className="shrink-0 text-muted-foreground">{placeholder}</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full bg-transparent text-right font-medium text-foreground outline-none"
        />
        {suffix}
      </div>
    </div>
  );
}

function TextInputRow({
  defaultValue,
  className,
}: {
  defaultValue: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className={cn(
        "w-full rounded-lg border border-border bg-transparent px-4 py-3 text-muted-foreground outline-none focus:text-foreground",
        className,
      )}
    />
  );
}

function SectionDivider() {
  return <div className="border-t border-border" />;
}

/** Small stand-in for a token/quote-token glyph (three tinted bars). */
function TokenGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-end gap-0.5", className)}>
      <span className="h-2.5 w-1 rounded-full bg-dodger-blue" />
      <span className="h-3.5 w-1 rounded-full bg-primary" />
      <span className="h-2 w-1 rounded-full bg-casablanca" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Transaction                                                      */
/* ------------------------------------------------------------------ */

type BroadcastMode = "priority-fee" | "jito-only" | "mixed";
type PriorityLevel = "fast" | "turbo" | "ultra";
type RebalancingType = "swap" | "swapless";

function TransactionTab() {
  const [broadcastMode, setBroadcastMode] =
    useState<BroadcastMode>("jito-only");
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>("ultra");
  const [rebalancingType, setRebalancingType] =
    useState<RebalancingType>("swap");

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          Transaction Broadcasting
        </p>
        <SegmentedControl
          value={broadcastMode}
          onChange={setBroadcastMode}
          options={[
            { value: "priority-fee", label: "Priority Fee" },
            { value: "jito-only", label: "Jito Only" },
            { value: "mixed", label: "Mixed" },
          ]}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Rhiva submits your transaction through Jito Bundle only
        </p>
      </div>

      <SectionDivider />

      <div>
        <p className="mb-3 text-sm text-muted-foreground">Priority Level</p>
        <SegmentedControl
          value={priorityLevel}
          onChange={setPriorityLevel}
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
              onClick={() => setRebalancingType(option.value)}
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

type SlippagePreset = "0.1" | "0.5" | "1" | "custom";

function SlippagePresetField({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: SlippagePreset;
}) {
  const [preset, setPreset] = useState<SlippagePreset>(defaultValue);

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-foreground">{label}</p>
      <SegmentedControl
        tone="neutral"
        value={preset}
        onChange={setPreset}
        options={[
          { value: "0.1", label: "0.1%" },
          { value: "0.5", label: "0.5%" },
          { value: "1", label: "1%" },
          { value: "custom", label: "Custom" },
        ]}
      />
      <ValueInputRow className="mt-3" placeholder="Value" defaultValue="3%" />
    </div>
  );
}

function DlmmTab() {
  return (
    <div className="space-y-6">
      <SlippagePresetField label="Liquidity Spillage" defaultValue="custom" />
      <SlippagePresetField label="Swap Slippage" defaultValue="custom" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Zap In                                                          */
/* ------------------------------------------------------------------ */

type ZapCurveType = "spot" | "curve" | "bid-ask";

function ZapInTab() {
  const [curveType, setCurveType] = useState<ZapCurveType>("spot");

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-primary/10 p-4">
        <div className="flex items-center gap-2 text-primary">
          <Info className="size-4" />
          <p className="font-semibold">What is Zap In?</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a liquidity position instantly with one token and one
          click—using your preferred settings.
        </p>
      </div>

      <ValueInputRow
        label="Amount"
        placeholder="Zap in amount"
        defaultValue="0.1"
        suffix={<TokenGlyph />}
      />

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Slippage</p>
        <div className="space-y-3">
          <ValueInputRow placeholder="Liquidity Slippage" defaultValue="3 %" />
          <ValueInputRow placeholder="Swap Slippage" defaultValue="3 %" />
        </div>
      </div>

      <ValueInputRow
        label="Swap Price Impact"
        placeholder="Max Price Impact"
        defaultValue="2 %"
      />

      <SegmentedControl
        tone="soft"
        value={curveType}
        onChange={setCurveType}
        options={[
          { value: "spot", label: "Spot", icon: BarChart3 },
          { value: "curve", label: "Curve", icon: LineChart },
          { value: "bid-ask", label: "Bid Ask", icon: BarChart2 },
        ]}
      />

      <div className="flex items-center justify-end gap-2 rounded-lg border border-border px-4 py-3">
        <span className="size-3 rounded-sm bg-primary" />
        <span className="text-sm text-foreground">quote token</span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="text-primary">
          Reset
        </Button>
        <Button className="flex-1">Save</Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Trading Settings                                                */
/* ------------------------------------------------------------------ */

type PresetId = "preset-1" | "preset-2" | "preset-3";
type BuySellMode = "buy" | "sell";

function TradingSettingsTab() {
  const [preset, setPreset] = useState<PresetId>("preset-1");
  const [buySellMode, setBuySellMode] = useState<BuySellMode>("buy");
  const [autoFee, setAutoFee] = useState(false);

  return (
    <div className="space-y-6">
      <SegmentedControl
        tone="soft"
        value={preset}
        onChange={setPreset}
        options={[
          { value: "preset-1", label: "Preset 1" },
          { value: "preset-2", label: "Preset 2" },
          { value: "preset-3", label: "Preset 3" },
        ]}
      />

      <SegmentedControl
        tone="soft"
        value={buySellMode}
        onChange={setBuySellMode}
        options={[
          { value: "buy", label: "Buy Settings" },
          { value: "sell", label: "Sell Settings" },
        ]}
      />

      <ValueInputRow label="Slippage" placeholder="value" defaultValue="20%" />
      <ValueInputRow
        label="Priority"
        placeholder="value"
        defaultValue="0.001"
      />
      <ValueInputRow label="Bribe" placeholder="value" defaultValue="0.01" />

      <div className="flex items-center gap-3">
        {/** biome-ignore lint/a11y/noLabelWithoutControl: label already wraps an input */}
        <label className="flex shrink-0 items-center gap-2 text-foreground">
          <Checkbox
            checked={autoFee}
            onCheckedChange={(checked) => setAutoFee(checked === true)}
          />
          Auto Fee
        </label>
        <ValueInputRow
          className="flex-1"
          placeholder="Max Fee"
          defaultValue="0.01"
        />
      </div>

      <TextInputRow defaultValue="RPC https://a...e.com" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Others                                                          */
/* ------------------------------------------------------------------ */

interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

const initialNotificationSettings: NotificationSetting[] = [
  { id: "marketing", label: "Marketing & Activities", enabled: true },
  { id: "transactions", label: "Transactions", enabled: true },
  { id: "events", label: "Events Alert", enabled: true },
];

function OthersTab() {
  const [settings, setSettings] = useState(initialNotificationSettings);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Message Notifications</p>
      <div className="space-y-5">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <span className="text-foreground">{setting.label}</span>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => toggleSetting(setting.id)}
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
      <DialogContent className="gap-0 sm:max-w-auto w-fit border-border bg-background p-6">
        <DialogTitle className="sr-only">Settings</DialogTitle>

        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-6">
            {SETTINGS_TABS.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                data-active={activeTab === tab.id ? true : undefined}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-6">
          {activeTab === "transaction" && <TransactionTab />}
          {activeTab === "dlmm" && <DlmmTab />}
          {activeTab === "zap-in" && <ZapInTab />}
          {activeTab === "trading-settings" && <TradingSettingsTab />}
          {activeTab === "others" && <OthersTab />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
