"use client";

import { Settings, ShieldAlert, SlidersHorizontal, Zap } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const TABS = ["Watchlist", "Radar", "Trending", "Surge", "Pump", "Live"];

interface TabAction {
  label: string;
  icon: React.ReactNode;
}

export function SubNavbar() {
  const [activeTab, setActiveTab] = React.useState("Radar");

  const actions: TabAction[] = [
    {
      label: "Customize",
      icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
    },
    {
      label: "Blacklist",
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    },
    {
      label: "Quick Sell",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      label: "Settings",
      icon: <Settings className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="w-full flex items-center justify-between py-3 border-b border-white/5 bg-[#0A0A0A] font-inter">
      {/* Left side: Navigation Tabs */}
      <div className="flex items-center gap-6 md:gap-8">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              type="button"
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative py-1 text-sm font-semibold tracking-wide transition-colors cursor-pointer outline-none select-none",
                isActive
                  ? "text-[#00D897]"
                  : "text-white/40 hover:text-white/70",
              )}
            >
              {tab}
              {isActive && (
                <div className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-[#00D897]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side: Action Control Buttons */}
      <div className="flex items-center gap-3">
        {actions.map((action) => (
          <button
            type="button"
            type="button"
            key={action.label}
            className="flex items-center gap-1.5 px-3 py-1.5 h-8 bg-[#121212] border border-[#242424] hover:border-white/20 rounded-md text-xs font-semibold text-white/70 hover:text-white transition-all cursor-pointer"
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
