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
import { SolanaIcon } from "../../../components/ui/icons";
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
      <DialogContent className="p-0 sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Portfolio</DialogTitle>
        </DialogHeader>

        <div className="p-5">
          {/* Portfolio Summary */}
          <div className="mb-4 rounded-xl border border-border/70 bg-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-b-4 text-gray uppercase tracking-wider">
                  Total Value
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <h2 className="font-bold text-h4 text-white">$25.32</h2>

                  <span className="font-semibold text-b-3 text-down">
                    -4.49%
                  </span>
                </div>
              </div>

              <SwapDialog>
                <Button className="min-w-24 self-start px-6 sm:self-auto">
                  Swap
                </Button>
              </SwapDialog>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border/70">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] border-border/70 border-b bg-muted/20 px-5 py-3 font-semibold text-b-4 text-gray uppercase tracking-wider">
              <div>TOKEN NAME</div>
              <div>PRICE/24H CHANGE</div>
              <div className="text-right">BALANCE</div>
            </div>

            <ScrollArea className="h-[400px]">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center border-border/40 border-b px-5 py-3.5 transition-colors last:border-none hover:bg-white/2"
                >
                  {/* Token */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/40 bg-[#141414]">
                      <SolanaIcon className="size-4" />
                    </div>

                    <div>
                      <p className="font-semibold text-b-3 text-white leading-tight">
                        {asset.name}
                      </p>
                      <p className="mt-0.5 text-b-5 text-gray leading-tight">
                        {asset.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="font-semibold text-b-3 text-white leading-tight">
                      {asset.price}
                    </p>
                    <p className="mt-0.5 font-semibold text-b-5 text-down leading-tight">
                      {asset.change}
                    </p>
                  </div>

                  {/* Balance */}
                  <div className="text-right">
                    <p className="font-semibold text-b-3 text-white leading-tight">
                      {asset.balance}
                    </p>
                    <p className="mt-0.5 text-b-5 text-gray leading-tight">
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
