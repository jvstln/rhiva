"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SolanaIcon } from "../ui/icons";

import { SwapDialog } from "./SwapDialog";

const assets = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  name: "Solana",
  symbol: "SOL",
  price: "$187.39",
  change: "-4.49%",
  balance: "$25.31",
  amount: "0.14 SOL",
}));

export function TokenDialog({
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof Dialog> & { children: React.ReactElement }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Portfolio</DialogTitle>
        </DialogHeader>

        <div className="p-5">
          {/* Portfolio Summary */}
          <div className="mb-4 rounded-xl border border-border/70 bg-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-b-4 font-semibold uppercase tracking-wider text-gray">
                  Total Value
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <h2 className="text-h4 font-bold text-white">$25.32</h2>

                  <span className="text-b-3 font-semibold text-down">
                    -4.49%
                  </span>
                </div>
              </div>

              <SwapDialog>
                <Button className="min-w-24 px-6 self-start sm:self-auto">
                  Swap
                </Button>
              </SwapDialog>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border/70">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-border/70 bg-muted/20 px-5 py-3 text-b-4 font-semibold uppercase tracking-wider text-gray">
              <div>TOKEN NAME</div>
              <div>PRICE/24H CHANGE</div>
              <div className="text-right">BALANCE</div>
            </div>

            <ScrollArea className="h-[400px]">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center border-b border-border/40 px-5 py-3.5 last:border-none hover:bg-white/2 transition-colors"
                >
                  {/* Token */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#141414] border border-border/40 shrink-0">
                      <SolanaIcon className="size-4" />
                    </div>

                    <div>
                      <p className="text-b-3 font-semibold text-white leading-tight">
                        {asset.name}
                      </p>
                      <p className="text-b-5 text-gray leading-tight mt-0.5">
                        {asset.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-b-3 font-semibold text-white leading-tight">
                      {asset.price}
                    </p>
                    <p className="text-b-5 text-down font-semibold leading-tight mt-0.5">
                      {asset.change}
                    </p>
                  </div>

                  {/* Balance */}
                  <div className="text-right">
                    <p className="text-b-3 font-semibold text-white leading-tight">
                      {asset.balance}
                    </p>
                    <p className="text-b-5 text-gray leading-tight mt-0.5">
                      {asset.amount}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
