"use client";

import { debounce } from "lodash";
import { Filter, Rocket } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SettingsDialog } from "@/components/layout/SettingsDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Timeframe } from "@/features/market/market.schema";
import { capitalize } from "@/lib/utils";
import { PoolColumns } from "../liquidity.schema";
import { useLiquidityStore } from "../liquidity.store";
import { PoolFiltersDialog } from "./PoolFiltersDialog";

export function PoolsToolbar() {
  const searchParams = useSearchParams();
  const activeView = PoolColumns.catch("trending").parse(
    searchParams.get("view"),
  );
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

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

        <ToggleGroup>
          {Timeframe.options.slice(-5, -1).map((tf) => (
            <ToggleGroupItem key={tf} value={tf}>
              {tf}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

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
