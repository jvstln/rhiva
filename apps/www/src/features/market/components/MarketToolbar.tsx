"use client";

import { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";

import { capitalize, cn } from "@/lib/utils";
import { MarketView } from "../market.schema";
import { useMarketStore } from "../market.store";
import { RadarToolbar } from "./RadarToolbar";
import { SurgeToolbar } from "./SurgeToolbar";
import { TrendingToolbar } from "./TrendingToolbar";
import { buttonVariants } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type MarketToolbarProps = { exclude?: MarketView[]; include?: MarketView[] };

export function MarketToolbar({ exclude = [], include }: MarketToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeView = useMarketStore((state) => state.activeView);
  const setActiveView = useMarketStore((state) => state.setActiveView);

  const view: MarketView = pathname === "/radar" ? "radar" : activeView;

  const handleTabClick = (tab: MarketView) => {
    setActiveView(tab);
    if (pathname === "/radar" && tab !== "radar") {
      router.push("/");
    }
  };

  return (
    <div
      className={cn(
        "flex max-sm:flex-col sm:w-full sm:items-center sm:justify-between sm:border-b sm:px-4 sm:pt-2 md:gap-12",
      )}
    >
      <ScrollArea className={"min-w-0 basis-1/2"}>
        <TabsList
          variant="ghost"
          className="flex h-auto w-max items-center gap-0.5 bg-transparent p-0 py-2"
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
                <TabsTrigger
                  value={tab}
                  onClick={() => handleTabClick(tab)}
                  data-active={view === tab}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "cursor-pointer data-active:bg-muted data-active:text-foreground",
                  )}
                  aria-current={view === tab ? "page" : undefined}
                >
                  {capitalize(tab)}
                </TabsTrigger>
                {index === 0 && (
                  <span
                    className="h-4 w-px bg-white/30"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            );
          })}
        </TabsList>
        <ScrollBar
          orientation="horizontal"
          showIndicator
          showScrollBar
        />
      </ScrollArea>

      <ScrollArea className={"w-fit min-w-0"}>
        {view === "trending" && <TrendingToolbar />}
        {view === "radar" && <RadarToolbar />}
        {view === "surge" && <SurgeToolbar />}
        {view === "top-gainers" && <TrendingToolbar />}
        {view === "latest" && <TrendingToolbar />}
        {view === "stock" && <TrendingToolbar />}
        {view === "stablecoin" && <TrendingToolbar />}
        <ScrollBar
          orientation="horizontal"
          showIndicator
        />
      </ScrollArea>
    </div>
  );
}
