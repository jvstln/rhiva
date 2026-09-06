"use client";

import {
  useGlobalMarketWebSocket,
  useGlobalMetadataWebSocket,
} from "@/features/market/market.ws";

export const GlobalMetadataListener = () => {
  useGlobalMetadataWebSocket();
  useGlobalMarketWebSocket();
  return null;
};
