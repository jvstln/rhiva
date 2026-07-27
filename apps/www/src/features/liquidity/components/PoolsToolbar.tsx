"use client";

import { debounce } from "lodash";
import { Filter, Rocket } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SettingsDialog } from "@/features/settings/components/SettingsDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
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
import { Separator } from "@/components/ui/separator";
import { capitalize } from "@/lib/utils";
import { PoolColumns } from "../liquidity.schema";
import { useLiquidityStore } from "../liquidity.store";
import { PoolFiltersDialog } from "./PoolFiltersDialog";

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
              <SelectItem key={tf} value={tf}>
                {tf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <PoolFiltersDialog>
          <Button variant="ghost" size="sm">
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
    <InputGroup className="w-36">
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

      <InputGroupAddon className="h-full">
        <Button size="sm" variant="secondary" onClick={onSettingsDialogOpen}>
          <Rocket className="text-emerald-400" />
          Zap in
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
