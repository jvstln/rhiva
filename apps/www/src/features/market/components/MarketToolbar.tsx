"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useSearchParams } from "next/navigation";

import { capitalize, cn } from "@/lib/utils";
import { MarketView } from "../market.schema";
import { RadarToolbar } from "./RadarToolbar";
import { SurgeToolbar } from "./SurgeToolbar";
import { PumpLiveToolbar } from "./PumpLiveToolbar";
import { TrendingToolbar } from "./TrendingToolbar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function MarketToolbar() {
  const searchParams = useSearchParams();
  const view = MarketView.parse(searchParams.get("view"));

  return (
    <div
      className={cn(
        "flex max-sm:flex-col sm:w-full sm:items-center sm:justify-between sm:border-b sm:px-4 sm:pt-2 md:gap-16",
      )}
    >
      <ScrollArea
        className={"min-w-0"}
        showIndicator
      >
        <nav
          className="flex w-max items-center gap-0.5 py-2"
          aria-label="Market sections"
        >
          {MarketView.unwrap().options.map((tab, index) => (
            <Fragment key={tab}>
              <Link
                href={`?view=${tab}`}
                data-active={view === tab}
                className={buttonVariants({ variant: "ghost" })}
                aria-current={view === tab ? "page" : undefined}
              >
                {capitalize(tab)}
              </Link>
              {index === 0 && (
                <span
                  className="h-4 w-px bg-white/30"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          ))}
        </nav>
        <ScrollBar
          orientation="horizontal"
          showIndicator={false}
        />
      </ScrollArea>

      <ScrollArea
        className={"min-w-0"}
        showIndicator
      >
        {view === "trending" && <TrendingToolbar />}
        {view === "radar" && <RadarToolbar />}
        {view === "surge" && <SurgeToolbar />}
        {view === "pumpLive" && <PumpLiveToolbar />}
        <ScrollBar
          orientation="horizontal"
          showIndicator
        />
      </ScrollArea>
    </div>
  );
}
