"use client";

import {
  FRESH_TOKENS,
  GRADUATED_TOKENS,
  HEATING_TOKENS,
} from "@/lib/mock/tokens";
import { Navbar } from "./navbar";
import { FloatingBot } from "./tokens/floating-bot";
// New sub-components
import { SubNavbar } from "./tokens/sub-navbar";
import { TradingColumn } from "./tokens/trading-column";

export function TokensPage() {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[1747px] flex flex-col relative px-4 pb-8">
        {/* Navigation Header */}
        <Navbar />

        {/* SubNavbar with tabs */}
        <div className="mt-2">
          <SubNavbar />
        </div>

        {/* Main Grid: Three scrollable trading columns */}
        <main className="mt-6 flex items-start justify-between gap-4 overflow-x-auto w-full pb-4">
          <TradingColumn title="Fresh" tokens={FRESH_TOKENS} />
          <TradingColumn
            title="Heating Up"
            tokens={HEATING_TOKENS}
            showMcHeader
          />
          <TradingColumn title="Graduated" tokens={GRADUATED_TOKENS} />
        </main>

        {/* Floating AI Bot Action Button */}
        <FloatingBot />
      </div>
    </div>
  );
}
