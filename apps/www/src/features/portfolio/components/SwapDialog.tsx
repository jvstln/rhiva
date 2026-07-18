"use client";

import { ArrowDownUp, ChevronDown } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SolanaIcon } from "../../../components/ui/icons";

export function SwapDialog({
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof Dialog> & { children?: React.ReactElement }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap</DialogTitle>
        </DialogHeader>

        <div className="relative flex flex-col">
          {/* Sell Card */}
          <div className="relative z-0 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-b-1 text-muted-foreground">
                Sell
              </span>
              <ToggleGroup>
                {["25%", "50%", "75%", "Max"].map((value) => (
                  <ToggleGroupItem
                    value={value}
                    key={value}
                  >
                    {value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline">
                <SolanaIcon />
                SOL
                <ChevronDown />
              </Button>
              <InputGroupInput
                type="text"
                placeholder="0"
                className="text-right text-h4"
              />
            </div>
            <div className="mt-3 flex justify-between font-semibold text-b-4 text-muted-foreground">
              <span>Balance: 0</span>
            </div>
          </div>

          {/* Swap Direction Button */}
          <Button
            variant="outline"
            size="icon"
            className="-translate-1/2 pointer-events-none absolute top-1/2 left-1/2 z-10 bg-background"
            disabled
          >
            <ArrowDownUp />
          </Button>

          {/* Buy Card */}
          <div className="relative z-0 my-2 rounded-xl border border-border/70 bg-muted/20 p-4">
            <span className="font-semibold text-b-1 text-muted-foreground">
              Buy
            </span>
            <div className="flex items-center justify-between">
              <Button variant="outline">
                <span className="font-bold text-[10px]">US</span>
                USDC
                <ChevronDown />
              </Button>
              <div className="mb-4 flex items-center justify-between"></div>

              <InputGroupInput
                type="text"
                placeholder="0"
                className="text-right text-h4"
              />
            </div>
            <div className="mt-3 flex justify-between font-semibold text-b-4 text-gray">
              <span>Balance: 0</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            disabled
          >
            Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
