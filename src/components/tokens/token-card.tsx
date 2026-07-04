"use client";

import { Copy, ExternalLink, Shield } from "lucide-react";
import * as React from "react";
import { DiscordIcon, TelegramIcon, XIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface TokenCardData {
  id: string;
  name: string;
  symbol: string;
  avatarUrl?: string;
  badgeCount?: string;
  address: string;
  volume: string;
  marketCap: string;
  oneHourChange: {
    value: string;
    isPositive: boolean;
  };
  stats: {
    safetyScore: string;
    liquidity: string;
    tax: string;
    score: string;
    netChange: string;
    txCount: string;
  };
  twitter?: {
    handle: string;
    followers: string;
  };
  pills: Array<{
    label: string;
    type: "danger" | "success" | "ocean" | "neutral";
  }>;
  buySellRatio: number; // e.g., 69 for 69% buy, 31% sell
}

interface TokenCardProps {
  token: TokenCardData;
}

export function TokenCard({ token }: TokenCardProps) {
  const [_copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative w-full h-[188px] flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
      {/* Left side: Avatar & Address */}
      <div className="flex flex-col items-center justify-center gap-2 w-[72px]">
        <div className="relative w-[72px] h-[72px]">
          {/* Avatar Container */}
          <div className="w-full h-full bg-[#121212] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* Custom avatar placeholder or visual */}
            <div className="w-[66px] h-[66px] rounded-md bg-[#1e1e1e] flex items-center justify-center relative">
              {/* Dual glowing dot avatar style */}
              <div className="flex gap-1.5 items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#00ddbb] shadow-[0_0_8px_#00ddbb]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F55832] shadow-[0_0_8px_#F55832]" />
              </div>
            </div>
          </div>

          {/* Top-Left Badge (e.g. 500+) */}
          {token.badgeCount && (
            <div className="absolute -top-1 -left-1.5 px-1.5 py-0.5 min-w-[14px] h-4 bg-[#121212] border border-[#525252] rounded-full flex items-center justify-center z-10">
              <span className="font-geist text-[9px] font-normal text-[#CCCCCC] leading-none">
                {token.badgeCount}
              </span>
            </div>
          )}

          {/* Bottom-Right Link Badge */}
          <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#121212] border border-[#F55832] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F55832]/20 transition-colors z-10">
            <ExternalLink className="w-2.5 h-2.5 text-[#F55832]" />
          </div>
        </div>

        {/* Shortened Address */}
        <button
          type="button"
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-[#808080] hover:text-white transition-colors uppercase font-inter cursor-pointer"
        >
          <span>{token.address}</span>
          <Copy className="w-2.5 h-2.5 opacity-60" />
        </button>
      </div>

      {/* Right side: Token Details */}
      <div className="flex flex-col justify-between flex-1 pl-4 h-[138px]">
        {/* Row 1: Title, Symbol, and Volume/MC */}
        <div className="flex justify-between items-center w-full">
          {/* Title & Symbol */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-bold text-lg text-white tracking-tight truncate max-w-[140px]">
              {token.name}
            </span>
            <span className="font-inter font-normal text-[13px] text-white/30 truncate max-w-[90px]">
              {token.symbol}
            </span>
            {/* Edit / link icons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3 h-3 text-[#808080] hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Volume and Market Cap */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              <span className="font-inter text-xs text-[#808080]">V</span>
              <span className="font-inter font-medium text-sm text-[#F5F5F5]">
                {token.volume}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="font-inter text-xs text-[#808080]">MC</span>
              <span className="font-inter font-medium text-sm text-[#F8B951]">
                {token.marketCap}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Micro-stats & Twitter */}
        <div className="flex justify-between items-center w-full">
          {/* Micro-stats grid */}
          <div className="flex items-center gap-3">
            {/* 1h Change */}
            <span
              className={cn(
                "font-inter font-medium text-sm tracking-tight",
                token.oneHourChange.isPositive
                  ? "text-[#00D897]"
                  : "text-[#DE5759]",
              )}
            >
              {token.oneHourChange.value}
            </span>

            {/* Badges icons (X, Telegram, Discord, website, custom indicators) */}
            <div className="flex items-center gap-1.5 text-[#808080]">
              <XIcon className="w-3 h-3 text-[#4EA7FA]" />
              <DiscordIcon className="w-3.5 h-3.5 text-[#F8B951]" />
              <TelegramIcon className="w-3 h-3 text-[#CCCCCC]" />
              <Shield className="w-3 h-3 text-[#CCCCCC]" />
            </div>

            {/* Other scores: 16/17, 35, 0/0%, 3 */}
            <div className="flex items-center gap-2 text-xs text-[#808080] font-inter">
              <span className="text-[#F5F5F5] font-medium">
                {token.stats.safetyScore}
              </span>
              <span className="text-[#F5F5F5] font-medium">
                {token.stats.liquidity}
              </span>
              <span className="text-[#F8B951] font-medium">
                {token.stats.tax}
              </span>
              <span className="text-[#F5F5F5] font-medium">
                {token.stats.score}
              </span>
            </div>
          </div>

          {/* Social info: handle & followers count */}
          {token.twitter && (
            <div className="flex items-center gap-2">
              <span className="font-inter font-medium text-xs text-[#4EA7FA] hover:underline cursor-pointer">
                {token.twitter.handle}
              </span>
              <div className="flex items-center gap-0.5 text-xs text-[#4EA7FA]">
                <XIcon className="w-2.5 h-2.5" />
                <span className="font-medium">{token.twitter.followers}</span>
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Security Net Change / TX Count */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#808080]">N</span>
              <span className="text-xs font-semibold text-[#46B87D]">
                {token.stats.netChange}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#808080]">TX</span>
              <span className="text-xs font-semibold text-[#F5F5F5]">
                {token.stats.txCount}
              </span>
            </div>

            {/* Buy / Sell ratio indicator line */}
            <div className="w-[45px] h-[3px] bg-[#DE5759] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#46B87D]"
                style={{ width: `${token.buySellRatio}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Status Pills & Action Buttons */}
        <div className="flex justify-between items-end w-full">
          {/* Mini Percentage Badges */}
          <div className="flex items-center gap-1.5">
            {token.pills.map((pill, idx) => (
              <div
                key={`${pill.label}-${idx}`}
                className="flex items-center justify-center px-1.5 py-0.5 border border-[#242424] rounded-[5px] bg-[#121212]"
              >
                <span
                  className={cn(
                    "font-inter font-medium text-[11px] leading-tight",
                    pill.type === "danger" && "text-[#DE5759]",
                    pill.type === "success" && "text-[#00D897]",
                    pill.type === "ocean" && "text-[#46B87D]",
                    pill.type === "neutral" && "text-[#CCCCCC]",
                  )}
                >
                  {pill.label}
                </span>
              </div>
            ))}
          </div>

          {/* Sell & Buy Trading Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              type="button"
              className="flex items-center justify-center px-3 py-1.5 h-7 min-w-[50px] bg-[#DE5759]/20 hover:bg-[#DE5759]/30 border border-[#DE5759]/30 hover:border-[#DE5759]/50 text-[#DE5759] font-inter font-bold text-xs rounded-[5px] transition-colors cursor-pointer"
            >
              Sell
            </button>
            <button
              type="button"
              type="button"
              className="flex items-center justify-center px-3 py-1.5 h-7 min-w-[50px] bg-[#00D897] hover:bg-[#00c589] text-black font-inter font-bold text-xs rounded-[5px] transition-colors cursor-pointer"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
