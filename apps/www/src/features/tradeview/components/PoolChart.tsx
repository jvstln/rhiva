"use client";

import { useCallback, useMemo } from "react";
import type { Candle } from "@rhivadotfun/dataapi";

import { getTokenCandles } from "@/features/market/market.api";
import type { Bar, ResolutionString } from "@/public/tradeview";
import type { Timeframe } from "@/features/market/market.schema";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import type { SearchResultItem } from "@/features/tradeview/tradeview.type";
import type { CreateDataFeedArgs } from "@/features/tradeview/datafeed-trpc";
import { TradeViewChart } from "@/features/tradeview/components/TradeViewChart";

const candleToBar = ({
  t_ms,
  open,
  high,
  low,
  close,
  volume_usd,
}: Candle): Bar => ({
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

type PoolChartProps = { pool: LiquidityPool };

export const PoolChart = ({ pool }: PoolChartProps) => {
  const baseSymbol = pool.token_a?.symbol || pool.base_symbol || "???";
  const quoteSymbol = pool.token_b?.symbol || "SOL";
  const pairName = `${baseSymbol}/${quoteSymbol}`;

  // Keyed by pair name so resolveSymbol cache-hits immediately without a search round-trip.
  // The pool chart plots the base token's candles — there is no pool OHLCV endpoint yet.
  const cachedSearchResults = useMemo<Record<string, SearchResultItem>>(() => {
    const quoteAddress = pool.token_b?.mint;
    return {
      [pairName]: {
        address: pool.pool_address,
        dex: { id: pool.dex },
        base_token: {
          address: pool.token_a?.mint ?? pool.base_mint,
          name: pool.token_a?.name ?? pool.base_symbol ?? "???",
          symbol: baseSymbol,
          image_url: pool.token_a?.logo_uri ?? "",
          // decimals may be missing from the pool payload — defaulted to 9 (SOL standard)
          decimals: pool.token_a?.decimals ?? 9,
        },
        quote_token: quoteAddress
          ? {
              address: quoteAddress,
              name: pool.token_b?.name ?? "SOL",
              symbol: quoteSymbol,
              image_url: pool.token_b?.logo_uri ?? "",
              decimals: pool.token_b?.decimals ?? 9,
            }
          : undefined,
      },
    };
  }, [
    pairName,
    baseSymbol,
    quoteSymbol,
    pool.pool_address,
    pool.dex,
    pool.base_mint,
    pool.base_symbol,
    pool.token_a?.mint,
    pool.token_a?.name,
    pool.token_a?.logo_uri,
    pool.token_a?.decimals,
    pool.token_b?.mint,
    pool.token_b?.name,
    pool.token_b?.logo_uri,
    pool.token_b?.decimals,
  ]);

  const baseMint = pool.token_a?.mint ?? pool.base_mint;

  // getBars fetches candles directly (not via hook) because it's called inside
  // the TradingView datafeed — hooks cannot be used here.
  const getBars = useCallback<CreateDataFeedArgs["getBars"]>(
    async ({ timeframe, filter }) => {
      // Map ChartTimeframe back to a market Timeframe for the candles API.
      const tfMap: Record<string, Timeframe> = {
        minute: "1m",
        hour: "1h",
        day: "1d",
        second: "1m",
      };
      const apiTimeframe = tfMap[timeframe] ?? "5m";

      if (!baseMint) return [];

      const candles = await getTokenCandles({
        mint: baseMint,
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
    [baseMint],
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
        symbol={pairName}
      />
    </div>
  );
};
