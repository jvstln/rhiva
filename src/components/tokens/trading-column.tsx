"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { TokenCard, type TokenCardData } from "./token-card";

interface TradingColumnProps {
  title: string;
  tokens: TokenCardData[];
  showMcHeader?: boolean;
}

export function TradingColumn({
  title,
  tokens,
  showMcHeader = false,
}: TradingColumnProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activePriority, setActivePriority] = React.useState<
    "P1" | "P2" | "P3" | null
  >("P1");

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col w-[571px] h-[1046px] border border-white/20 rounded-[10px] bg-[#0A0A0A] overflow-hidden flex-shrink-0">
      {/* Column Header Controls */}
      <div className="flex flex-col gap-3 p-4 border-b border-white/10 bg-[#0A0A0A]">
        {/* Title and top header details */}
        <div className="flex justify-between items-center w-full">
          <h2 className="font-inter font-bold text-[20px] text-white tracking-wide">
            {title}
          </h2>

          {showMcHeader && (
            <div className="flex items-center gap-1.5 cursor-pointer">
              <span className="font-inter text-xs font-semibold text-[#00D897]">
                % MC
              </span>
              <span className="w-2 h-2 border-r-2 border-b-2 border-[#00D897] transform rotate-45 -translate-y-0.5" />
            </div>
          )}
        </div>

        {/* Filters and Inputs row */}
        <div className="flex items-center justify-between gap-2.5 w-full">
          {/* Inner Search Field */}
          <div className="relative flex items-center w-[220px] h-8 bg-black/10 border border-white/5 rounded-md px-2.5">
            <Search className="w-3.5 h-3.5 text-[#737373] mr-1.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Keyword1,..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-[13px] text-white placeholder:text-[#737373] outline-none font-roboto"
            />
            {/* Badge counter */}
            <div className="absolute right-2 px-1 py-0.5 min-w-[14px] bg-[#121212] border border-[#525252] rounded flex items-center justify-center">
              <span className="text-[10px] font-geist text-[#CCCCCC] leading-none">
                0
              </span>
            </div>
          </div>

          {/* Priority selector: P1, P2, P3 */}
          <div className="flex items-center bg-[#121212] border border-[#242424] rounded-md p-0.5">
            {(["P1", "P2", "P3"] as const).map((priority) => (
              <button
                type="button"
                type="button"
                key={priority}
                onClick={() =>
                  setActivePriority(
                    priority === activePriority ? null : priority,
                  )
                }
                className={cn(
                  "px-2.5 py-1 text-[11px] font-bold font-inter rounded transition-colors cursor-pointer",
                  activePriority === priority
                    ? "bg-[#00D897] text-black"
                    : "text-[#808080] hover:text-white",
                )}
              >
                {priority}
              </button>
            ))}
          </div>

          {/* Configuration filter toggle button */}
          <button
            type="button"
            type="button"
            className="flex items-center justify-center w-8 h-8 bg-[#121212] border border-[#242424] rounded-md text-[#808080] hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Tokens List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredTokens.length > 0 ? (
          filteredTokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))
        ) : (
          <div className="flex items-center justify-center h-48 text-[#808080] font-inter text-sm">
            No matching tokens found
          </div>
        )}
      </div>
    </div>
  );
}
