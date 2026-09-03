"use client";

import { useCallback, useMemo } from "react";
import type { TokenFull, TokenOHlvc } from "@rhivadotfun/dataapi";

import { getTokenCandles } from "@/features/market/market.api";
import type { Bar, ResolutionString } from "@/public/tradeview";
import type { SearchResultItem } from "@/features/tradeview/tradeview.type";
import type { CreateDataFeedArgs } from "@/features/tradeview/datafeed-trpc";
import { TradeViewChart } from "@/features/tradeview/components/TradeViewChart";

const candleToBar = ({
  time,
  open,
  high,
  low,
  close,
  volume,
}: TokenOHlvc): Bar => ({
  time: time > 1e12 ? time : time * 1000,
  open,
  high,
  low,
  close,
  volume,
});

const SUPPORTED_RESOLUTIONS: ResolutionString[] = [
  "1",
  "5",
  "30",
  "60",
  "120",
  "240",
  "480",
  "1D",
] as ResolutionString[];

type TokenChartProps = { token: TokenFull };

export const TokenChart = ({ token }: TokenChartProps) => {
  // Keyed by mint so resolveSymbol cache-hits immediately without a search round-trip
  const cachedSearchResults = useMemo<Record<string, SearchResultItem>>(
    () => ({
      [token.mint]: {
        address: token.mint,
        base_token: {
          address: token.mint,
          name: token.name ?? token.mint,
          symbol: token.symbol ?? "???",
          image_url: token.image ?? "",
          decimals: token.decimals ?? 9,
        },
      },
    }),
    [token.mint, token.name, token.symbol, token.image, token.decimals],
  );

  // getBars fetches candles directly (not via hook) because it's called inside
  // the TradingView datafeed — hooks cannot be used here
  const getBars = useCallback<CreateDataFeedArgs["getBars"]>(
    async ({ address, filter }) => {
      const candles = await getTokenCandles({
        mint: address,
        count: filter.limit,
        to: filter.before_timestamp,
      });

      return candles
        .map(candleToBar)
        .filter((bar) => {
          const barTimeSec = bar.time / 1000;
          return barTimeSec <= filter.before_timestamp;
        })
        .sort((a, b) => a.time - b.time);
    },
    [],
  );

  const datafeedArgs = useMemo<CreateDataFeedArgs>(
    () => ({
      cachedSearchResults,
      getBars,
      defaultConfig: {
        network: "solana",
        supportedResolutions: SUPPORTED_RESOLUTIONS,
      },
    }),
    [cachedSearchResults, getBars],
  );

  return (
    <div className="size-full">
      <TradeViewChart
        datafeedArgs={datafeedArgs}
        symbol={token.mint}
      />
    </div>
  );
};
