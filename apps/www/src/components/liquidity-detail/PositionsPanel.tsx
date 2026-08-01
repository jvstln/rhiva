"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TABS = ["Positions", "History"] as const;

export function PositionsPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Positions");

  return (
    <div className="flex-1 border-border/70 border-t">
      <div className="flex items-center gap-6 px-4 py-3">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative pb-2 font-semibold text-b-2 transition-colors",
              tab === t ? "text-white" : "text-gray hover:text-white/70",
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-gray">
          <MapPin className="size-6" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-b-1 text-white">
            No Wallet Connected
          </p>
          <p className="mt-1 text-b-3 text-gray">
            Connect your wallet to view your open positions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>Connect Wallet</Button>
          <Button variant="secondary">Learn about DLMM</Button>
        </div>
      </div>
    </div>
  );
}
