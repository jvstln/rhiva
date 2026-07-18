"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  getRadarFreshTokens,
  getRadarGraduatedTokens,
  getRadarHeatedUpTokens,
  getSurgeGraduatedTokens,
  getTrendingTokens,
} from "./market.api";
import type {
  RadarFilters,
  SurgeFilters,
  TrendingFilters,
} from "./market.type";

export function useBirdeyeWS(channel: string) {
  const [wsData, setWsData] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Birdeye WS Endpoint (Check documentation for exact current cluster URL)
    const wsUrl = `wss://public-api.birdeye.so/socket/solana?x-api-key=${process.env.BIRDEYE_API_KEY}`;

    ws.current = new WebSocket(wsUrl, "echo-protocol");

    ws.current.onopen = () => {
      console.log(`Connected to Birdeye WS. Subscribing to ${channel}...`);

      // Send the subscription payload required by Birdeye
      const subPayload = {
        type: "SUBSCRIBE_TOKEN_NEW_LISTING",
        min_liquidity: 5000,
        meme_platform_enabled: true,
        sources: ["pump_dot_fun", "meteora_dynamic_bonding_curve"],
        // type: "subscribe",
        // channel: channel, // e.g., "new-token-listing" or "token-stats"
      };
      ws.current?.send(JSON.stringify(subPayload));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      console.log("ws received - ", message);

      if (message.type === "data") {
        setWsData((prevData) => {
          // Keep the list to a manageable size (e.g., last 50 updates)
          const updated = [message.data, ...prevData];
          return updated.slice(0, 50);
        });
      }
    };

    ws.current.onerror = (error) => console.error("WS Error:", error);
    ws.current.onclose = () => console.log("Birdeye WS Connection Closed");

    return () => {
      // Cleanup connection on unmount or tab change
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [channel]);

  return wsData;
}

export function useTrendingTokens(filters: TrendingFilters) {
  return useQuery({
    queryKey: ["market", "trending", filters.timeframe, filters.preset],
    queryFn: () => getTrendingTokens(filters),
  });
}

export function useRadarFreshTokens(filters: RadarFilters["fresh"]) {
  return useQuery({
    queryKey: ["market", "radar", "fresh"],
    queryFn: () => getRadarFreshTokens(filters),
  });
}

export function useRadarHeatedUpTokens(filters: RadarFilters["heatingUp"]) {
  return useQuery({
    queryKey: ["market", "radar", "heatingUp"],
    queryFn: () => getRadarHeatedUpTokens(filters),
  });
}

export function useRadarGraduatedTokens(filters: RadarFilters["graduated"]) {
  return useQuery({
    queryKey: ["market", "radar", "graduated"],
    queryFn: () => getRadarGraduatedTokens(filters),
  });
}

export function useSurgeTokens(filters: SurgeFilters) {
  const { quickBuy, ...rest } = filters;

  return useQuery({
    queryKey: ["market", "surge", rest],
    queryFn: () => getSurgeGraduatedTokens(filters),
  });
}
