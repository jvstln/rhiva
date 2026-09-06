"use client";

import { useState } from "react";
import { Info, Trash2, Copy, Download, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { truncateString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QueryState } from "@/components/layout/QueryState";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useBlacklistStore,
  type BlacklistCategory,
  type BlacklistItem,
} from "../blacklist.store";

const TABS = [
  "All",
  "Dev",
  "CA",
  "Keyword",
  "Website",
  "Twitter Hand",
] as const;
type TabType = (typeof TABS)[number];

const TAB_TO_CATEGORY: Record<Exclude<TabType, "All">, BlacklistCategory> = {
  Dev: "dev",
  CA: "ca",
  Keyword: "keyword",
  Website: "website",
  "Twitter Hand": "twitter",
};

const CATEGORY_TO_LABEL: Record<BlacklistCategory, string> = {
  dev: "DEV",
  ca: "CA",
  keyword: "KEYWORD",
  website: "WEB",
  twitter: "TWITTER",
};

function detectCategory(value: string): BlacklistCategory {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return "website";
  }
  if (
    trimmed.startsWith("@") ||
    trimmed.includes("twitter.com") ||
    trimmed.includes("x.com")
  ) {
    return "twitter";
  }
  if (trimmed.length >= 32 && trimmed.length <= 44 && !trimmed.includes(" ")) {
    return "ca";
  }
  return "keyword";
}

export function BlacklistDialog({
  children,
  ...props
}: Dialog.Props & { children?: React.ReactElement }) {
  const [selectedTab, setSelectedTab] = useState<TabType>("All");
  const [inputValue, setInputValue] = useState("");
  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState("");

  const items = useBlacklistStore((state) => state.items);
  const addItem = useBlacklistStore((state) => state.addItem);
  const removeItem = useBlacklistStore((state) => state.removeItem);
  const clearAll = useBlacklistStore((state) => state.clearAll);
  const importItems = useBlacklistStore((state) => state.importItems);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const category: BlacklistCategory =
      selectedTab === "All"
        ? detectCategory(trimmed)
        : TAB_TO_CATEGORY[selectedTab];

    const added = addItem(category, trimmed);
    if (added) {
      toast.success(`Added ${trimmed} to ${category} blacklist`);
      setInputValue("");
    } else {
      toast.info("Item is already blacklisted");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleExport = () => {
    if (items.length === 0) {
      toast.info("No blacklist items to export");
      return;
    }
    const json = JSON.stringify(items, null, 2);
    navigator.clipboard
      .writeText(json)
      .then(() => toast.success("Blacklist JSON copied to clipboard"))
      .catch(() => toast.error("Failed to copy export to clipboard"));
  };

  const handleImport = () => {
    const trimmed = importText.trim();
    if (!trimmed) {
      toast.error("Please enter blacklist JSON or text to import");
      return;
    }

    try {
      let parsed: unknown;
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        parsed = JSON.parse(trimmed);
      } else {
        // Fallback: lines or comma separated
        const lines = trimmed
          .split(/[\n,]+/)
          .map((l) => l.trim())
          .filter(Boolean);
        parsed = lines.map((val) => ({
          type: detectCategory(val),
          value: val,
        }));
      }

      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];
      const count = importItems(itemsToImport);
      toast.success(`Imported ${count} blacklist items`);
      setImportText("");
      setShowImportExport(false);
    } catch {
      toast.error("Invalid JSON format for blacklist import");
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedTab === "All") return true;
    return item.type === TAB_TO_CATEGORY[selectedTab];
  });

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Blacklist</DialogTitle>
        </DialogHeader>

        {showImportExport ? (
          <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Import / Export</span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowImportExport(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Paste a JSON array of blacklist items or export your current
              blacklist.
            </p>
            <textarea
              className="h-36 w-full rounded-md border border-input bg-background p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder='[{"type":"ca","value":"..."},{"type":"dev","value":"..."}]'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Export JSON
              </Button>
              <Button
                size="sm"
                onClick={handleImport}
                className="gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                Import
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full min-w-0 flex-col gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Input
                data-size="sm"
                placeholder={
                  selectedTab === "All"
                    ? "Enter twitter profile, dev address, CA, or keyword"
                    : `Enter ${selectedTab} to blacklist`
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="sm"
                onClick={handleAdd}
              >
                Blacklist
              </Button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Info className="h-4 w-4 shrink-0" />
              <p>Add multiple blacklist types (CA, Dev, Twitter, Keyword)</p>
            </div>

            <Tabs
              value={selectedTab}
              onValueChange={(tab) => setSelectedTab(tab as TabType)}
              className="-mx-4"
            >
              <ScrollArea showIndicator>
                <TabsList
                  variant="line"
                  className="w-full border-b px-4"
                >
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>

            <ScrollArea className="-mx-4 h-[280px] px-4">
              {filteredItems.length === 0 ? (
                <QueryState
                  query={{ data: [] }}
                  getIsEmpty={() => ({
                    title: "No blacklist items",
                    description: "Items you blacklist will appear here",
                  })}
                />
              ) : (
                <div className="flex flex-col gap-1.5 py-1">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border border-border/50 bg-card/40 px-3 py-2 text-xs transition-colors hover:bg-muted/40"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="px-1.5 py-0 font-semibold text-[10px] uppercase"
                        >
                          {CATEGORY_TO_LABEL[item.type]}
                        </Badge>
                        <span
                          className="truncate font-medium font-mono"
                          title={item.value}
                        >
                          {item.value.length > 30
                            ? truncateString(item.value, 12)
                            : item.value}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            removeItem(item.id);
                            toast.success(
                              `Removed ${item.value} from blacklist`,
                            );
                          }}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="-mx-4 -mb-4 flex items-center justify-between border-border/70 border-t px-4 py-4">
              <span className="font-medium text-muted-foreground text-xs">
                {items.length} / 5000 blacklists
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportExport(true)}
                >
                  Import/Export
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={items.length === 0}
                  onClick={() => {
                    clearAll();
                    toast.success("All blacklists deleted");
                  }}
                >
                  Delete all
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
