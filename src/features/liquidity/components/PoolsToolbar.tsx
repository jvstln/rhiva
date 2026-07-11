"use client";

import { Filter, Rocket } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
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

export function PoolsToolbar() {
  const searchParams = useSearchParams();
  const activeView = PoolColumns.catch("trending").parse(
    searchParams.get("view"),
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-2">
      <div className="flex items-center gap-1">
        {PoolColumns.options.map((col, index) => (
          <React.Fragment key={col}>
            <Link
              href={`?view=${col}`}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
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
        <SettingsDialog defaultTab="zap-in">
          <Button size="sm" variant="ghost">
            <Rocket className="text-emerald-400" />
            Zap In
          </Button>
        </SettingsDialog>

        <InputGroup size="sm" className="max-w-20">
          <InputGroupInput />
          <InputGroupAddon align={"inline-end"}>
            <SolanaIcon />
          </InputGroupAddon>
        </InputGroup>

        <ToggleGroup>
          {Timeframe.options.slice(-5, -1).map((tf) => (
            <ToggleGroupItem key={tf} value={tf}>
              {tf}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Button variant="ghost" size="sm">
          <Filter className="text-muted-foreground" />
          Filter
        </Button>
      </div>
    </div>
  );
}
