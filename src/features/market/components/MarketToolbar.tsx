"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { capitalize, cn } from "@/lib/utils";
import { MarketView } from "../market.schema";
import { PumpLiveToolbar } from "./PumpLiveToolbar";
import { RadarToolbar } from "./RadarToolbar";
import { SurgeToolbar } from "./SurgeToolbar";
import { TrendingToolbar } from "./TrendingToolbar";

export function MarketToolbar() {
  const searchParams = useSearchParams();
  const view = MarketView.parse(searchParams.get("view"));

  return (
    <div
      className={cn("flex w-full items-center justify-between p-4 md:gap-16")}
    >
      <nav className="flex items-center gap-0.5" aria-label="Market sections">
        {MarketView.unwrap().options.map((tab, i) => (
          <React.Fragment key={tab}>
            <Link
              href={`?view=${tab}`}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              aria-current={view === tab ? "page" : undefined}
              data-active={view === tab ? true : undefined}
            >
              {capitalize(tab)}
            </Link>
            {i === 0 && (
              <span className="h-4 w-px bg-white/30" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </nav>

      <ScrollArea className={"min-w-0"} showIndicator>
        {view === "trending" && <TrendingToolbar />}
        {view === "radar" && <RadarToolbar />}
        {view === "surge" && <SurgeToolbar />}
        {view === "pumpLive" && <PumpLiveToolbar />}
        <ScrollBar orientation="horizontal" showIndicator />
      </ScrollArea>
    </div>
  );
}
