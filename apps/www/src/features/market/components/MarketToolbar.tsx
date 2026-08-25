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
import { usePathname } from "next/navigation";

type MarketToolbarProps = { exclude?: MarketView[]; include?: MarketView[] };

export function MarketToolbar({ exclude = [], include }: MarketToolbarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const view = MarketView.parse(searchParams.get("view"));

  return (
    <div
      className={cn(
        "flex max-sm:flex-col sm:w-full sm:items-center sm:justify-between sm:border-b sm:px-4 sm:pt-2 md:gap-12",
      )}
    >
      <ScrollArea className={"min-w-0 basis-1/2"}>
        <nav
          className="flex w-max items-center gap-0.5 py-2"
          aria-label="Market sections"
        >
          {MarketView.unwrap().options.map((tab, index) => {
            if (
              exclude.includes(tab) ||
              (Array.isArray(include) && !include.includes(tab))
            )
              return null;

            return (
              <Fragment key={tab}>
                <Link
                  href={`?view=${tab}`}
                  data-active={view === tab || pathname.includes(tab)}
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
            );
          })}
        </nav>
        <ScrollBar
          orientation="horizontal"
          showIndicator
          showScrollBar
        />
      </ScrollArea>

      <ScrollArea className={"min-w-0"}>
        {view === "trending" && <TrendingToolbar />}
        {view === "radar" && <RadarToolbar />}
        {view === "surge" && <SurgeToolbar />}
        {view === "top-gainers" && <TrendingToolbar />}
        {view === "latest" && <TrendingToolbar />}
        {view === "stock" && <TrendingToolbar />}
        {view === "stablecoin" && <TrendingToolbar />}
        {/* {view === "pumpLive" && <PumpLiveToolbar />} */}
        <ScrollBar
          orientation="horizontal"
          showIndicator
        />
      </ScrollArea>
    </div>
  );
}
