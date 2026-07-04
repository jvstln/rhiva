"use client";

import {
  ArrowLeftRight,
  ArrowUpDown,
  ChevronDown,
  Coins,
  EyeOff,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { PortfolioTab } from "@/app/(dashboard)/portfolio/page";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { LP_POSITIONS, POSITIONS } from "@/data/portfolio-data";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TradingPositionsTable } from "./TradingPositionsTable";

interface PositionsTableProps {
  activeTab: PortfolioTab;
}

const TRADING_TABS = ["Active positions", "History", "Top 100"] as const;
const LP_TABS = ["Opened Position", "History"] as const;

const TRADING_COLUMNS = [
  "Token",
  "Bought",
  "Sold",
  "Remaining",
  "PNL",
  "Holding Duration",
  "Action",
] as const;

const LP_COLUMNS = [
  "POSITION/POOL",
  "PnL",
  "Total Deposit",
  "Total Withdraw",
  "Total Fees Earned",
  "", // Actions
] as const;

export function PositionsTable({ activeTab }: PositionsTableProps) {
  const [lpSubTab, setLpSubTab] =
    useState<(typeof LP_TABS)[number]>("Opened Position");

  const isTrading = activeTab === "Trading Position";
  const columns = isTrading ? TRADING_COLUMNS : LP_COLUMNS;

  return (
    <section className="space-y-4">
      {isTrading && (
        <Tabs defaultValue={"Active positions"}>
          {isTrading && (
            <TabsList variant={"ghost"}>
              {TRADING_TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          <TradingPositionsTable />
        </Tabs>
      )}

      <div className="flex items-center gap-6 border-b border-border/70 pb-3">
        {!isTrading && (
          <>
            {/* All pools dropdown */}
            <button
              type="button"
              className="flex items-center gap-1.5 text-b-2 font-semibold text-white hover:text-primary transition-colors"
            >
              All pools
              <ChevronDown className="size-4" />
            </button>

            {LP_TABS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setLpSubTab(t)}
                className={cn(
                  "text-b-2 font-semibold transition-colors",
                  lpSubTab === t
                    ? "text-primary"
                    : "text-gray hover:text-white/70",
                )}
              >
                {t}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border/70 text-b-3 text-gray">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap py-3 pr-6 font-medium"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LP_POSITIONS.map((p, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-4 pr-6">
                  <Link
                    href="/token"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <AvatarGroup>
                      <Avatar size="sm">
                        <AvatarFallback className="bg-linear-to-br from-cyan-400 to-indigo-500 text-[10px] text-white">
                          {p.pool.split("-")[0][0]}
                        </AvatarFallback>
                      </Avatar>
                      <Avatar size="sm">
                        <AvatarFallback className="bg-linear-to-br from-pink-400 to-rose-500 text-[10px] text-white">
                          {p.pool.split("-")[1][0]}
                        </AvatarFallback>
                      </Avatar>
                    </AvatarGroup>
                    <div>
                      <p className="text-b-3 font-semibold text-white group-hover:text-primary transition-colors">
                        {p.pool}
                      </p>
                      <p className="flex items-center gap-1.5 text-b-5 text-gray mt-0.5">
                        <span>{p.timeAgo}</span>
                        {p.badge && <span>{p.badge}</span>}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="py-4 pr-6">
                  <p className="text-b-3 font-medium text-up">{p.pnlUsd}</p>
                  <p className="text-b-5 text-up font-medium">{p.pnlPct}</p>
                </td>
                <td className="py-4 pr-6 text-b-3 text-white font-medium">
                  {p.totalDeposit}
                </td>
                <td className="py-4 pr-6 text-b-3 text-white font-medium">
                  {p.totalWithdraw}
                </td>
                <td className="py-4 pr-6 text-b-3 text-white font-medium">
                  {p.totalFeesEarned}
                </td>
                <td className="py-4 pr-6">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Claim Fees"
                      className="rounded bg-up/10 p-1.5 text-up transition-colors hover:bg-up/20"
                    >
                      <Coins className="size-4" />
                    </button>
                    <button
                      type="button"
                      title="Rebalance"
                      className="rounded bg-dodger-blue/10 p-1.5 text-dodger-blue transition-colors hover:bg-dodger-blue/20"
                    >
                      <ArrowLeftRight className="size-4" />
                    </button>
                    <button
                      type="button"
                      title="Remove Liquidity"
                      className="rounded bg-down/10 p-1.5 text-down transition-colors hover:bg-down/20"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
