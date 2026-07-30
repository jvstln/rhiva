"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { arrayWithId, capitalize, cn } from "@/lib/utils";

const TABS = ["full", "custom"] as const;
type Tab = (typeof TABS)[number];

export function OrcaTradeRail() {
  const [tab, setTab] = useState<Tab>("full");

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as Tab)}
    >
      <TabsList
        className="w-full"
        variant={"line"}
      >
        {TABS.map((t) => (
          <TabsTrigger
            key={t}
            value={t}
          >
            {capitalize(t)}
          </TabsTrigger>
        ))}
      </TabsList>

      {tab === "full" ? <OrcaFullTab /> : <OrcaCustomTab />}
    </Tabs>
  );
}

function InfoRow({
  label,
  value,
  isTag = false,
}: {
  label: string;
  value: string;
  isTag?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-b-4">
      <div className="flex items-center gap-2 text-gray">
        {label}
        {isTag && (
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
            24H
          </span>
        )}
      </div>
      <span className="text-white">{value}</span>
    </div>
  );
}

function YieldDepositCard({
  currencies = ["SOL", "USDC"],
}: {
  currencies?: Array<"SOL" | "USDC">;
}) {
  const solPercent =
    currencies.length > 1
      ? "50.0%"
      : currencies.includes("SOL")
        ? "100.0%"
        : "0.0%";

  const usdcPercent =
    currencies.length > 1
      ? "50.0%"
      : currencies.includes("USDC")
        ? "100.0%"
        : "0.0%";

  return (
    <div className="space-y-3 rounded-xl border border-border/70 p-4">
      <InfoRow
        label="Estimated Yield"
        value="0.028%"
        isTag
      />
      <InfoRow
        label="Deposit"
        value={`${solPercent} SOL / ${usdcPercent} USDC`}
      />
    </div>
  );
}

function SummaryFees() {
  return (
    <div className="space-y-3 pt-2">
      <InfoRow
        label="Estimated Yield"
        value="-"
        isTag
      />
      <div className="my-4 h-px w-full bg-border/40" />
      <div className="flex items-center justify-between text-b-4 text-gray">
        <span className="underline decoration-dashed underline-offset-4">
          Non-Refundable Fees
        </span>
        <span className="text-white text-xs">{"<"}0.01SOL</span>
      </div>
      <div className="flex items-center justify-between text-b-4 text-gray">
        <span className="underline decoration-dashed underline-offset-4">
          Refundable Fees
        </span>
        <span className="text-white text-xs">0.01SOL</span>
      </div>
    </div>
  );
}

function OrcaFullTab() {
  return (
    <div className="fade-in animate-in space-y-6 duration-300">
      <YieldDepositCard />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-b-4 text-gray">Deposit Amount</span>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
          >
            <SlidersHorizontal />
          </Button>
        </div>

        <div className="relative flex min-h-[100px] flex-col justify-center rounded-xl border border-border/70 bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              defaultValue="0"
              className="w-full bg-transparent font-semibold text-2xl text-white outline-none"
            />
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr from-purple-500 to-cyan-500 font-bold text-[10px] text-white shadow-sm">
                S
              </div>
              <span className="font-semibold text-sm text-white">SOL</span>
            </div>
          </div>
          <div className="mt-1 text-b-4 text-gray">$0.00</div>
        </div>
      </div>

      <SummaryFees />

      <div className="sticky bottom-4 bg-background py-2">
        <Button className="w-full">Open Position</Button>
      </div>
    </div>
  );
}

function OrcaCustomTab() {
  const [tradeType, setTradeType] = useState<"full" | "single">("full");
  const [selectedCurrency, setSelectedCurrency] = useState<"SOL" | "USDC">(
    "SOL",
  );

  return (
    <div className="fade-in animate-in space-y-6 duration-300">
      <div className="text-center text-b-5 text-white">
        Current Price: 0.05329 SOL per USDC
      </div>

      <div className="relative mt-2 flex h-24 w-full items-end gap-[1px]">
        {arrayWithId(60).map(({ id }, i) => (
          <div
            key={id}
            className={cn(
              "flex-1",
              i >= 20 && i <= 40 ? "bg-primary" : "bg-white/20",
            )}
            style={{ height: `${Math.max(10, Math.random() * 100)}%` }}
          />
        ))}
        {/* Bottom Bar */}
        <div className="absolute right-0 bottom-[-4px] left-0 flex h-1">
          <div
            className="flex-1 bg-white/20"
            style={{ flexGrow: 20 }}
          />
          <div
            className="flex-1 bg-primary"
            style={{ flexGrow: 21 }}
          />
          <div
            className="flex-1 bg-white/20"
            style={{ flexGrow: 19 }}
          />
        </div>
        {/* Handles */}
        <div className="absolute top-0 bottom-[-16px] left-[33%] z-10 w-0.5 bg-white" />
        <div className="absolute top-0 bottom-[-16px] left-[68%] z-10 w-0.5 bg-white" />
        <div className="absolute bottom-[-16px] left-[33%] h-4 w-1.5 -translate-x-1/2 rounded-sm bg-white" />
        <div className="absolute bottom-[-16px] left-[68%] h-4 w-1.5 -translate-x-1/2 rounded-sm bg-white" />
      </div>

      <div className="mt-4 flex justify-between text-[10px] text-white">
        <span>0.05216</span>
        <span>0.05216</span>
        <span>0.05216</span>
        <span>0.05216</span>
        <span>0.05216</span>
        <span>0.05216</span>
        <span>0.05216</span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-b-4 text-gray">Trade amount</span>
          <ToggleGroup
            size="sm"
            value={[tradeType]}
            onValueChange={([value]) => setTradeType(value as typeof tradeType)}
            spacing={0}
          >
            <ToggleGroupItem value="full">Full-sided</ToggleGroupItem>
            <ToggleGroupItem value="single">Single-sided</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="relative flex flex-col justify-center rounded-xl border border-border/70 bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              defaultValue="0.0"
              className="w-full bg-transparent font-semibold text-white text-xl outline-none"
            />
            <span className="font-semibold text-gray text-sm">SOL</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray text-xs">Balance: 0 SOL</span>
          <div className="flex items-center gap-3 text-gray text-xs">
            <ToggleGroup
              size="sm"
              defaultValue={["max"]}
              spacing={0}
            >
              <ToggleGroupItem value="25">25%</ToggleGroupItem>
              <ToggleGroupItem value="50">50%</ToggleGroupItem>
              <ToggleGroupItem value="max">Max</ToggleGroupItem>
            </ToggleGroup>
            <Button
              size={"icon-sm"}
              variant={"ghost"}
            >
              <SlidersHorizontal />
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-2 *:flex-1">
          <Button
            variant={
              selectedCurrency.includes("SOL") || tradeType === "full"
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCurrency("SOL")}
          >
            SOL
          </Button>
          <Button
            variant={
              selectedCurrency.includes("USDC") || tradeType === "full"
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCurrency("USDC")}
          >
            USDC
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <YieldDepositCard
          currencies={
            tradeType === "full" ? ["SOL", "USDC"] : [selectedCurrency]
          }
        />
      </div>

      <SummaryFees />

      <div className="sticky bottom-4 bg-background py-2">
        <Button className="w-full">Open Position</Button>
      </div>
    </div>
  );
}
