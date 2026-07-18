"use client";

import { ChevronDown, Repeat, Settings, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BondingCurveToggle } from "@/features/market/components/ToolbarItems";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "../layout/SettingsDialog";
import { XIcon } from "../ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";

const QUICK_AMOUNTS = ["0.01", "0.1", "0.5", "1"] as const;

export function TradePanel() {
  const [side, setSide] = useState<"buy" | "sell" | "lp">("buy");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-3 border-border/70 border-t p-4">
      <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
        <div className="flex items-center justify-between text-b-4">
          <span className="text-gray">Dev's Best Token</span>
          <span className="font-medium text-white">TikTok (ATH MC $231K)</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-1">
        <span className="flex items-center gap-1.5 font-medium text-b-3 text-white">
          <XIcon />
          Connection
        </span>
        <span className="font-semibold text-b-3 text-white">99+</span>
      </div>

      <div className="flex items-center justify-between">
        <BondingCurveToggle />

        <SettingsDialog defaultTab="trading-settings">
          <Button
            size={"icon"}
            variant={"ghost"}
          >
            <Settings />
          </Button>
        </SettingsDialog>
      </div>

      <Tabs
        value={side}
        onValueChange={(v) => setSide(v as typeof side)}
      >
        <TabsList
          variant={"soft"}
          className={"w-full"}
        >
          {(["Buy", "Sell"] as const).map((s) => (
            <TabsTrigger
              key={s}
              value={s.toLowerCase()}
              className={cn(s === "Sell" && "data-active:bg-sell/20")}
            >
              {s}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex items-center justify-end text-b-4 text-gray">
          Bal: 0 SOL
        </div>

        <div className="">
          <InputGroup className="rounded-md rounded-b-none">
            <InputGroupInput
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>SOL</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div className="grid grid-cols-4">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setAmount(amt)}
                className="border border-border/70 py-1.5 font-medium text-b-4 text-gray first:rounded-bl-md last:rounded-br-md hover:border-primary/50 hover:text-white"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        <p className="text-b-5 text-gray">1 SOL ≈ 438.7K TikTok</p>

        <TabsContent value="buy">
          <Button className="w-full">Buy</Button>
        </TabsContent>
        <TabsContent value="sell">
          <Button
            className="w-full"
            variant={"sell"}
          >
            Sell
          </Button>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between text-b-5 text-gray">
        <span className="flex items-center gap-1">
          <Zap className="size-3" /> Auto
        </span>
        <span>0.006039</span>
        <span className="flex items-center gap-1">
          <Repeat className="size-3" />
          {"<0.01"}
        </span>
        <span>Red.</span>
        <ChevronDown className="size-3" />
      </div>
    </div>
  );
}
