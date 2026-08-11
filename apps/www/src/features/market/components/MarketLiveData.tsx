"use client";

import type React from "react";
import { useMarketWebsocket } from "../market.ws";

/**
 * Mounts the market WebSocket feeds for every market view (trending, surge,
 * radar, ...)
 */
export const MarketLiveData = ({ children }: { children: React.ReactNode }) => {
  useMarketWebsocket();
  return children;
};
