"use client";
import { TradeViewChart } from "@/features/tradeview/components/TradeViewChart";
import type { CreateDataFeedArgs } from "@/features/tradeview/datafeed-trpc";
import type { SearchResultItem } from "@/features/tradeview/tradeview.type";
import type { Bar, ResolutionString } from "@/public/tradeview";
import { useCallback, useMemo } from "react";
import { getTokenCandles } from "@/features/market/market.api";
import type { Token, TokenCandle } from "@/features/market/market.token.type";
import type { Timeframe } from "@/features/market/market.schema";

const candleToBar = ({
  t_ms,
  open,
  high,
  low,
  close,
  volume_usd,
}: TokenCandle): Bar => ({
  time: t_ms, // already in milliseconds — TradingView expects ms
  open,
  high,
  low,
  close,
  volume: volume_usd,
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

type TokenChartProps = { token: Token };

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
          image_url: token.logo_uri ?? "",
          // decimals is currently not available from the token API — defaulted to 9 (SOL standard)
          decimals: token.decimals ?? 9,
        },
        // No dex/pool context at the token level; treated as a bare token (no quote_token)
      },
    }),
    [token.mint, token.name, token.symbol, token.logo_uri, token.decimals],
  );

  // getBars fetches candles directly (not via hook) because it's called inside
  // the TradingView datafeed — hooks cannot be used here
  const getBars = useCallback<CreateDataFeedArgs["getBars"]>(
    async ({ address, timeframe, filter }) => {
      // Map ChartTimeframe back to a market Timeframe for the candles API.
      // The datafeed translates TradingView resolutions → ChartTimeframe internally;
      // we re-derive from the filter limit/timestamps to pick the right bucket.
      // Simpler: use the resolution the widget passes via the datafeed pipeline,
      // which is already in `timeframe` ("minute" | "hour" | "day").
      const tfMap: Record<string, Timeframe> = {
        minute: "1m",
        hour: "1h",
        day: "24h",
        second: "1m",
      };
      const apiTimeframe = tfMap[timeframe] ?? "5m";

      const candles = await getTokenCandles({
        mint: address,
        timeframe: apiTimeframe,
        limit: filter.limit,
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
    <div style={{ height: "500px", width: "100%" }}>
      <TradeViewChart
        datafeedArgs={datafeedArgs}
        symbol={token.mint}
      />
    </div>
  );
};
