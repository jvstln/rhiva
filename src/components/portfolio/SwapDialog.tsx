"use client";

import { ArrowDownUp, ChevronDown } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SolanaIcon } from "../ui/icons";

export function SwapDialog({
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof Dialog> & { children?: React.ReactElement }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="sm:max-w-[420px] p-0 border-border/70 overflow-hidden bg-card">
        <DialogHeader className="p-5 pb-4 border-b border-border/70">
          <DialogTitle className="text-h4 font-bold text-white">
            Swap
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 flex flex-col relative pb-6 ">
          {/* Required div.relative for positioning button */}
          <div className="relative">
            {/* Sell Card */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 relative z-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-b-3 font-semibold text-gray">Sell</span>
                <div className="flex gap-1.5">
                  {["25%", "50%", "75%", "Max"].map((perc) => (
                    <Button key={perc} variant="outline" size="sm">
                      {perc}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline">
                  <SolanaIcon />
                  SOL
                  <ChevronDown />
                </Button>
                <Input
                  type="text"
                  placeholder="0"
                  className="w-full border-none bg-transparent p-0 text-right text-h3 font-bold text-white placeholder:text-gray/50 focus-visible:ring-0 shadow-none h-auto"
                />
              </div>
              <div className="mt-3 flex justify-between text-b-4 font-semibold text-gray">
                <span>Balance: 0</span>
              </div>
            </div>
            {/* Swap Direction Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-1/2 -translate-1/2 bg-background"
            >
              <ArrowDownUp />
            </Button>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] flex items-center justify-center z-10">
              {/* <button className="flex size-10 items-center justify-center rounded-full bg-card border-[3px] border-card text-white hover:text-primary transition-colors shadow-sm">
                <div className="flex size-full items-center justify-center rounded-full bg-white/5 border border-border/40">
                  <ArrowDownUp className="size-4" />
                </div>
              </button> */}
            </div>
            {/* Buy Card */}
            <div className="mt-2 rounded-xl border border-border/70 bg-muted/20 p-4 relative z-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-b-3 font-semibold text-gray">Buy</span>
              </div>
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 rounded-full bg-white/5 border border-border/40 pl-2 pr-3 py-1.5 hover:bg-white/10 transition-colors shrink-0">
                  <div className="flex size-6 items-center justify-center rounded-full bg-[#2775CA] shrink-0 text-white">
                    <span className="text-[10px] font-bold">US</span>
                  </div>
                  <span className="text-b-3 font-bold text-white">USDC</span>
                  <ChevronDown className="size-4 text-gray" />
                </button>
                <Input
                  type="text"
                  placeholder="0"
                  className="w-full border-none bg-transparent p-0 text-right text-h3 font-bold text-white placeholder:text-gray/50 focus-visible:ring-0 shadow-none h-auto"
                />
              </div>
              <div className="mt-3 flex justify-between text-b-4 font-semibold text-gray">
                <span>Balance: 0</span>
              </div>
            </div>
          </div>

          <Button className="mt-5 w-full font-bold h-12 text-b-2" disabled>
            Swap
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
