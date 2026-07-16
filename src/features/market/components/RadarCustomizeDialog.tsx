import {
  Activity,
  ChevronRight,
  Circle,
  Eye,
  LayoutGrid,
  MousePointer2,
  Network,
  RefreshCcw,
  RefreshCw,
  Square,
  Zap,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

// --- Primitives ---

const DATA_ROWS = [
  "Top10 Hold",
  "DEV",
  "Dev Burnt",
  "Insiders",
  "Bundlers",
  "Bundlers ATH",
  "Vanish",
  "Phishing",
  "Fresh",
  "Snipers Hold",
  "Rug",
  "Socials",
  "Total Fees",
  "OG",
  "Token Tax",
  "CTO",
  "Dex AD Paid",
  "Update Social",
  "Dex Boost",
  "Dex Bar Paid",
  "X Search",
  "Volume",
  "Market Cap",
  "Net Buy",
  "TXs",
  "Bot Trading",
  "Currently viewing",
  "Track Wallets",
  "Dev Token",
  "Holders",
  "KOLs",
  "Smart Money",
  "X Handle",
  "X Followers",
  "AI Narrative",
  "Callouts",
  "Telegram Calls",
];

export function SettingsSection({
  title,
  children,
  className,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="font-medium text-muted-foreground text-sm">{title}</div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function SettingRow({
  label,
  control,
  icon: Icon,
}: {
  label: React.ReactNode;
  control: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-medium text-xs">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </div>
      <div className="flex items-center gap-2">{control}</div>
    </div>
  );
}

export function ToggleButtonGroup({
  value,
  onValueChange,
  options,
}: {
  value: string;
  onValueChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(val) => onValueChange(val[0])}
      size="sm"
    >
      {options.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value}>
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function SizeCardOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-border/70 bg-card p-3 transition-all hover:bg-muted/50",
        selected && "border-primary bg-primary/5",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded bg-muted px-2 py-1 text-muted-foreground",
          selected && "bg-primary text-primary-foreground",
        )}
      >
        <Zap className="h-3 w-3 fill-current" />
        <span className="font-bold text-[10px]">5</span>
      </div>
      <span
        className={cn(
          "font-medium text-muted-foreground text-xs",
          selected && "text-foreground",
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function BalanceCardOption({
  label,
  topLabel,
  selected,
  onClick,
}: {
  label: string;
  topLabel: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[60px] flex-col items-center justify-center gap-1 rounded-xl border border-border/70 bg-card p-2 transition-all hover:bg-muted/50",
        selected && "border-primary bg-primary/5",
      )}
    >
      <div className="flex items-center gap-1 font-medium text-[10px] text-muted-foreground">
        {topLabel}
      </div>
      <span
        className={cn(
          "font-medium text-muted-foreground text-xs",
          selected && "text-foreground",
        )}
      >
        {label}
      </span>
    </button>
  );
}

// --- Main Dialog Component ---

export function RadarCustomizeDialog({
  children,
}: Dialog.Props & { children: React.ReactElement }) {
  // Layout state
  const [hiddenTokens, setHiddenTokens] = React.useState("hide_all");
  const [logoShape, setLogoShape] = React.useState("square");
  const [progressStyle, setProgressStyle] = React.useState("ring");
  const [tablesStyle, setTablesStyle] = React.useState("compact");
  const [rClickAction, setRClickAction] = React.useState("not_open");
  const [avatarReused, setAvatarReused] = React.useState("show");
  const [holdersBubblemap, setHoldersBubblemap] = React.useState("show");
  const [nameMenu, setNameMenu] = React.useState("show");
  const [avatarWindow, setAvatarWindow] = React.useState("show");
  const [searchMenu, setSearchMenu] = React.useState("show");
  const [afterBuy, setAfterBuy] = React.useState("skip");

  // Display state
  const [cardSize, setCardSize] = React.useState("mega");
  const [secondButton, setSecondButton] = React.useState("buy");
  const [enabledArea, setEnabledArea] = React.useState("almost_bonded");
  const [tradeTrigger, setTradeTrigger] = React.useState("on_press");
  const [holdingBalance, setHoldingBalance] = React.useState("both");

  // Data state
  const [selectedDataRows, setSelectedDataRows] =
    React.useState<string[]>(DATA_ROWS);

  const toggleDataRow = (row: string) => {
    setSelectedDataRows((prev) =>
      prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row],
    );
  };

  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}

      <Tabs defaultValue="display" className="flex w-full flex-col">
        <DialogContent className="">
          <DialogHeader className="pb-0">
            <DialogTitle className={"sr-only"}>
              Customize radar view
            </DialogTitle>
            <TabsList variant="line">
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>
          </DialogHeader>

          <ScrollArea className="h-[500px]">
            <TabsContent
              value="display"
              className="m-0 space-y-6 p-4 outline-none"
            >
              <SettingsSection>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  <SizeCardOption
                    label="Small"
                    selected={cardSize === "small"}
                    onClick={() => setCardSize("small")}
                  />
                  <SizeCardOption
                    label="Large"
                    selected={cardSize === "large"}
                    onClick={() => setCardSize("large")}
                  />
                  <SizeCardOption
                    label="Mega"
                    selected={cardSize === "mega"}
                    onClick={() => setCardSize("mega")}
                  />
                  <SizeCardOption
                    label="Jumbo"
                    selected={cardSize === "jumbo"}
                    onClick={() => setCardSize("jumbo")}
                  />
                </div>

                <Item variant={"outline"}>
                  <ItemTitle>Customize</ItemTitle>
                  <ItemActions className="grow">
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                  </ItemActions>
                </Item>
              </SettingsSection>

              <SettingsSection>
                <SettingRow
                  label="Button Color"
                  control={
                    <>
                      <Checkbox />
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  }
                />

                <SettingRow
                  label={
                    <div className="flex items-center gap-2">
                      2nd Button - By Amount
                      <RefreshCcw className="h-3 w-3 text-muted-foreground" />
                    </div>
                  }
                  control={
                    <ToggleButtonGroup
                      value={secondButton}
                      onValueChange={setSecondButton}
                      options={[
                        { value: "buy", label: "Buy" },
                        { value: "sell", label: "Sell" },
                        { value: "off", label: "Off" },
                      ]}
                    />
                  }
                />

                <div className="-mt-2 flex items-center gap-2">
                  <div className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
                    P1
                  </div>
                  <div className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
                    P2
                  </div>
                  <div className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
                    P3
                  </div>
                  <div className="flex-1" />
                  <Checkbox />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </SettingsSection>

              <SettingsSection>
                <SettingRow
                  label="Enabled Area"
                  control={
                    <ToggleButtonGroup
                      value={enabledArea}
                      onValueChange={setEnabledArea}
                      options={[
                        { value: "new", label: "New" },
                        { value: "almost_bonded", label: "Almost bonded" },
                        { value: "migrated", label: "Migrated" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  label="Trade Trigger Timing"
                  control={
                    <ToggleButtonGroup
                      value={tradeTrigger}
                      onValueChange={setTradeTrigger}
                      options={[
                        { value: "on_press", label: "On Press" },
                        { value: "on_release", label: "On Release" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  label="Holding Balance"
                  control={
                    <ToggleButtonGroup
                      value={holdingBalance}
                      onValueChange={setHoldingBalance}
                      options={[
                        { value: "sol", label: "SOL" },
                        { value: "usd", label: "USD" },
                        { value: "off", label: "Off" },
                      ]}
                    />
                  }
                />

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <BalanceCardOption
                    label="Balance"
                    topLabel={
                      <>
                        Ticker <span className="text-primary">= 0.1</span>
                      </>
                    }
                    selected={holdingBalance === "sol"}
                    onClick={() => setHoldingBalance("sol")}
                  />
                  <BalanceCardOption
                    label="PnL"
                    topLabel={
                      <>
                        Ticker <span className="text-primary">= +0.1</span>
                      </>
                    }
                    selected={holdingBalance === "usd"}
                    onClick={() => setHoldingBalance("usd")}
                  />
                  <BalanceCardOption
                    label="Both"
                    topLabel={
                      <>
                        Ticker <span className="text-primary">= 0.1</span>{" "}
                        <span className="text-primary">= +0.1</span>
                      </>
                    }
                    selected={holdingBalance === "both"}
                    onClick={() => setHoldingBalance("both")}
                  />
                </div>
              </SettingsSection>

              <SettingsSection>
                <SettingRow
                  icon={Eye}
                  label="Hidden Tokens"
                  control={
                    <ToggleButtonGroup
                      value={hiddenTokens}
                      onValueChange={setHiddenTokens}
                      options={[
                        { value: "show_migrated", label: "Show Migrated" },
                        { value: "show_all", label: "Show All" },
                        { value: "hide_all", label: "Hide All" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={Square}
                  label="Logo"
                  control={
                    <ToggleButtonGroup
                      value={logoShape}
                      onValueChange={setLogoShape}
                      options={[
                        { value: "circle", label: "Circle" },
                        { value: "square", label: "Square" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={Circle}
                  label="Progress"
                  control={
                    <ToggleButtonGroup
                      value={progressStyle}
                      onValueChange={setProgressStyle}
                      options={[
                        { value: "ring", label: "Ring" },
                        { value: "bar", label: "Bar" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={LayoutGrid}
                  label="Tables"
                  control={
                    <ToggleButtonGroup
                      value={tablesStyle}
                      onValueChange={setTablesStyle}
                      options={[
                        { value: "spaced", label: "Spaced" },
                        { value: "compact", label: "Compact" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={MousePointer2}
                  label="R-click"
                  control={
                    <ToggleButtonGroup
                      value={rClickAction}
                      onValueChange={setRClickAction}
                      options={[
                        { value: "not_open", label: "Not open" },
                        { value: "new_tab", label: "New Tab" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={Activity}
                  label="Avatar Reused"
                  control={
                    <ToggleButtonGroup
                      value={avatarReused}
                      onValueChange={setAvatarReused}
                      options={[
                        { value: "show", label: "Show" },
                        { value: "hide", label: "Hide" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={Network}
                  label="Holders Bubblemap"
                  control={
                    <ToggleButtonGroup
                      value={holdersBubblemap}
                      onValueChange={setHoldersBubblemap}
                      options={[
                        { value: "show", label: "Show" },
                        { value: "hide", label: "Hide" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={MousePointer2}
                  label="Name Menu"
                  control={
                    <ToggleButtonGroup
                      value={nameMenu}
                      onValueChange={setNameMenu}
                      options={[
                        { value: "show", label: "Show" },
                        { value: "hide", label: "Hide" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={MousePointer2}
                  label="Avatar Window"
                  control={
                    <ToggleButtonGroup
                      value={avatarWindow}
                      onValueChange={setAvatarWindow}
                      options={[
                        { value: "show", label: "Show" },
                        { value: "hide", label: "Hide" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={MousePointer2}
                  label="Search Menu"
                  control={
                    <ToggleButtonGroup
                      value={searchMenu}
                      onValueChange={setSearchMenu}
                      options={[
                        { value: "show", label: "Show" },
                        { value: "hide", label: "Hide" },
                      ]}
                    />
                  }
                />
                <SettingRow
                  icon={ChevronRight}
                  label="After Buy"
                  control={
                    <ToggleButtonGroup
                      value={afterBuy}
                      onValueChange={setAfterBuy}
                      options={[
                        { value: "check_chart", label: "Check Chart" },
                        { value: "jump_to", label: "Jump to" },
                        { value: "skip", label: "Skip" },
                      ]}
                    />
                  }
                />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="data">
              <Item>
                <ItemContent>
                  <ItemTitle>Customize Rows</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDataRows(
                        selectedDataRows.length === 0 ? DATA_ROWS : [],
                      );
                    }}
                  >
                    {selectedDataRows.length === 0 ? "Select" : "Unselect"} All
                  </Button>
                </ItemActions>
              </Item>

              <div className="flex flex-wrap gap-2">
                {DATA_ROWS.map((row) => (
                  <Toggle
                    key={row}
                    variant="outline"
                    pressed={selectedDataRows.includes(row)}
                    onPressedChange={() => toggleDataRow(row)}
                    size={"sm"}
                  >
                    {row}
                  </Toggle>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="layout"
              className="m-0 space-y-6 p-4 outline-none"
            ></TabsContent>
          </ScrollArea>
        </DialogContent>
      </Tabs>
    </Dialog>
  );
}
