"use client";

import Link from "next/link";
import { ChevronLeft, SearchX } from "lucide-react";

import { cn } from "@/lib/utils";
import { MeteoraIcon } from "@/components/ui/icons";
import { Button, buttonVariants } from "@/components/ui/button";

export function PoolNotFound() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Decorative icon with glow */}
        <div className="relative">
          <div className="flex size-20 items-center justify-center rounded-2xl border border-border/50 bg-card/50">
            <SearchX className="size-10 text-muted-foreground" />
          </div>
          <div className="absolute -inset-4 -z-10 rounded-full bg-primary/5 blur-2xl" />
        </div>

        {/* Error code */}
        <div className="space-y-2">
          <p className="font-bold font-mono text-[5rem]/none text-white/10 tracking-tighter">
            404
          </p>
          <h2 className="font-heading font-semibold text-white text-xl">
            Pool not found
          </h2>
          <p className="text-balance text-muted-foreground text-sm">
            The liquidity pool you're looking for doesn't exist or may have been
            removed. Check the pool address and try again.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ChevronLeft /> Go back
          </Button>
          <Link
            href="/liquidity"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <MeteoraIcon className="size-4" />
            Browse pools
          </Link>
        </div>
      </div>
    </div>
  );
}
