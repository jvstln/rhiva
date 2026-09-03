"use client";

/* ------------------------------------------------------------------ */
/* Shared types                                                         */
/* ------------------------------------------------------------------ */

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettingsStore } from "../settings.store";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SettingsTabId =
  // | "transaction"
  // | "lp"
  // | "zap-in"
  "trading-settings" | "others";

const SETTINGS_TABS: { id: SettingsTabId; label: string }[] = [
  // { id: "transaction", label: "Transaction" },
  // { id: "lp", label: "LP" },
  // { id: "zap-in", label: "Zap In" },
  { id: "trading-settings", label: "Trading Settings" },
  { id: "others", label: "Others" },
];

/* ------------------------------------------------------------------ */
/* Shared building blocks                                               */
/* ------------------------------------------------------------------ */

interface SegmentedOption<T extends string | number> {
  value: T | "custom";
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T | "custom";
  onChange: (value: T) => void;
  tone?: "solid" | "soft" | "neutral";
  className?: string;
}

function SegmentedControl<T extends string | number>({
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
            disabled={option.value === "custom"}
            onClick={() => {
              if (option.value !== "custom") onChange(option.value);
            }}
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

interface ValueInputRowProps<T extends string | number> {
  label?: string;
  value?: T;
  defaultValue?: T;
  className?: string;
  placeholder: string;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
}

function ValueInputRow<T extends string | number>({
  label,
  placeholder,
  defaultValue,
  value: controlledValue,
  onChange,
  suffix,
  className,
}: ValueInputRowProps<T>) {
  const [localValue, setLocalValue] = useState<string>(
    defaultValue ? defaultValue.toString() : String(),
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!isControlled) setLocalValue(value);
    onChange?.(value);
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

  const activeConfig = useMemo(() => {
    return trading.presets[trading.activePreset]?.[trading.activeBuySellMode];
  }, [trading.presets, trading.activePreset, trading.activeBuySellMode]);

  const autoFee = useMemo(
    () => !("priorityFee" in activeConfig),
    [activeConfig],
  );

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
        onChange={(value) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            slippage: parseFloat(value),
          })
        }
      />
      <ValueInputRow
        label="Priority"
        placeholder="value"
        value={
          "priorityFee" in activeConfig ? activeConfig.priorityFee : undefined
        }
        onChange={(value) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            priorityFee: parseFloat(value),
          })
        }
      />
      <ValueInputRow
        label="Bribe"
        placeholder="value"
        value={"bribe" in activeConfig ? activeConfig.bribe : undefined}
        onChange={(value) =>
          updateTradingConfig(trading.activePreset, trading.activeBuySellMode, {
            bribe: parseFloat(value),
          })
        }
      />

      <div className="flex items-center gap-3">
        <Field
          orientation="horizontal"
          className="w-fit"
        >
          <Checkbox
            checked={autoFee}
            onCheckedChange={(checked) =>
              updateTradingConfig(
                trading.activePreset,
                trading.activeBuySellMode,
                checked
                  ? {
                      maxFee:
                        "maxFee" in activeConfig
                          ? activeConfig.maxFee
                          : undefined,
                    }
                  : {
                      maxFee:
                        "maxFee" in activeConfig
                          ? activeConfig.maxFee
                          : undefined,
                      priorityFee:
                        "priorityFee" in activeConfig
                          ? activeConfig.priorityFee
                          : undefined,
                    },
              )
            }
          />
          <FieldLabel>Auto Fee</FieldLabel>
        </Field>
        <ValueInputRow
          className="flex-1"
          placeholder="Max Fee"
          value={"maxFee" in activeConfig ? activeConfig.maxFee : undefined}
          onChange={(value) =>
            updateTradingConfig(
              trading.activePreset,
              trading.activeBuySellMode,
              { maxFee: parseFloat(value) },
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
          <div
            key={setting.id}
            className="flex items-center justify-between"
          >
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
  defaultTab = "trading-settings",
  children,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(defaultTab);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
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
              {/* {activeTab === "transaction" && <TransactionTab />}
              {activeTab === "lp" && <LpTab />}
              {activeTab === "zap-in" && <ZapInTab />} */}
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
