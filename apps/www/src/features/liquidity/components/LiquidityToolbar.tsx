"use client";

import Link from "next/link";
import { debounce } from "lodash";
import React, { useState } from "react";
import { Filter, Rocket } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { capitalize } from "@/lib/utils";
import { PoolColumns } from "../liquidity.schema";
import { SolanaIcon } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { useLiquidityStore } from "../liquidity.store";
import { PoolFiltersDialog } from "./LiquidityFiltersDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { SettingsDialog } from "@/features/settings/components/SettingsDialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMEFRAMES = ["1m", "5m", "30m", "1h", "2h", "4h", "12h", "24h"];

export function PoolsToolbar() {
  const searchParams = useSearchParams();
  const activeView = PoolColumns.catch("trending").parse(
    searchParams.get("view"),
  );
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("2h");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-2">
      <div className="flex items-center gap-1">
        {PoolColumns.options.map((col, index) => (
          <React.Fragment key={col}>
            <Link
              href={`?view=${col}`}
              className={buttonVariants({ variant: "ghost" })}
              data-active={activeView === col ? true : undefined}
            >
              {capitalize(col).replace(/rwa/i, "RWA")}
            </Link>
            {index === 0 && <Separator orientation="vertical" />}{" "}
          </React.Fragment>
        ))}
      </div>

      {/* Filters */}
      <div className="inline-flex items-center gap-2">
        <ZapInInput onSettingsDialogOpen={() => setSettingsDialogOpen(true)} />

        <Select
          value={timeframe}
          onValueChange={(val) => {
            if (val) setTimeframe(val);
          }}
        >
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEFRAMES.map((tf) => (
              <SelectItem
                key={tf}
                value={tf}
              >
                {tf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <PoolFiltersDialog>
          <Button
            variant="ghost"
            size="sm"
          >
            <Filter className="text-muted-foreground" />
            Filter
          </Button>
        </PoolFiltersDialog>
      </div>

      {settingsDialogOpen && (
        <SettingsDialog
          defaultTab="zap-in"
          open={true}
          onOpenChange={() => setSettingsDialogOpen(false)}
        />
      )}
    </div>
  );
}

const ZapInInput = ({
  onSettingsDialogOpen,
}: {
  onSettingsDialogOpen?: () => void;
}) => {
  const zapIn = useLiquidityStore((state) => state.liquidityFilters.zapIn);
  const setFilters = useLiquidityStore((state) => state.setLiquidityFilters);

  const [internalValue, setInternalValue] = useState(zapIn?.toString() || "");

  return (
    <div className="flex w-40 rounded-full border *:rounded-none *:border-0 *:first:rounded-s-full *:last:rounded-e-full *:[button]:h-auto">
      <Button
        size="sm"
        variant="soft"
        onClick={onSettingsDialogOpen}
      >
        <Rocket />
        Zap in
      </Button>
      <InputGroup data-size={"sm"}>
        <InputGroupInput
          value={internalValue}
          onChange={(e) => {
            setInternalValue(e.target.value);
            debounce(() => {
              setFilters({
                zapIn: e.target.value ? Number(e.target.value) : null,
              });
            }, 800)();
          }}
        />
        <InputGroupAddon align={"inline-end"}>
          <SolanaIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
