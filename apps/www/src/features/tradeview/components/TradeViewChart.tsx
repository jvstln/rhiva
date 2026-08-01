"use client";

import { useEffect, useRef } from "react";

import { type ResolutionString, widget } from "@/public/tradeview";
import { type CreateDataFeedArgs, createDatafeed } from "../datafeed-trpc";

type TradeViewChartProps = {
  symbol: string;
  datafeedArgs: CreateDataFeedArgs;
} & React.ComponentProps<"div">;

export function TradeViewChart({
  symbol,
  datafeedArgs,
  ...props
}: TradeViewChartProps) {
  const tvContainer = useRef<HTMLDivElement>(null);
  const tvWidget = useRef<InstanceType<typeof widget>>(null);

  useEffect(() => {
    const container = tvContainer.current;
    if (container) {
      const w = new widget({
        symbol,
        container,
        debug: true,
        autosize: true,
        locale: "en",
        interval: "5" as ResolutionString,
        datafeed: createDatafeed(datafeedArgs),
        disabled_features: [
          "symbol_search_hot_key",
          "header_quick_search",
          "header_quick_search",
          "symbol_search_hot_key",
          "border_around_the_chart",
        ],
        theme: "dark",
        custom_css_url: "/tradeview.css",
        loading_screen: {
          backgroundColor: "#000B1A",
          foregroundColor: "#2962FF",
        },
        overrides: {
          "paneProperties.background": "#010E1F",
          "paneProperties.backgroundType": "solid",
        },
        library_path: "/tradeview/",
      });

      w.onChartReady(() => {
        w.changeTheme("dark").then(() => {
          w.applyOverrides({
            "paneProperties.background": "#010E1F",
            "paneProperties.backgroundType": "solid",
            "paneProperties.legendProperties.showBackground": false,
            "paneProperties.legendProperties.showStudyTitles": false,
            "mainSeriesProperties.style": 1,
            "chartproperties.paneProperties.background": "#010E1F",
            "scalesProperties.backgroundColor": "#010E1F",
          });
        });
      });
      tvWidget.current = w;
    }
    return () => {
      tvWidget.current?.remove();
      tvWidget.current = null;
    };
  }, [datafeedArgs, symbol]);

  return (
    <div
      ref={tvContainer}
      {...props}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        ...props.style,
      }}
    />
  );
}
