"use client";

import { Eye, Filter, Pencil } from "lucide-react";
import { useState } from "react";
import { TRADE_TABS, TRADES } from "@/data/token-detail-data";
import { cn } from "@/lib/utils";

const COLUMNS = [
  "Age",
  "Type",
  "MC",
  "Amount",
  "Total USD",
  "Gas",
  "Trader",
] as const;

export function TradesTable() {
  const [tab, setTab] = useState<(typeof TRADE_TABS)[number]>("Trades");

  return (
    <section className="border-border/70 border-t">
      <div className="flex items-center gap-6 overflow-x-auto px-6 py-3">
        {TRADE_TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 font-semibold text-b-2 transition-colors",
              tab === t ? "text-primary" : "text-gray hover:text-white/70",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-border/70 border-b text-b-4 text-gray">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap py-2 pr-6 font-medium"
                >
                  {col}
                </th>
              ))}
              <th className="py-2 pr-6 text-right font-medium">Tracking</th>
              <th className="py-2 text-right font-medium">DEV</th>
            </tr>
          </thead>
          <tbody>
            {TRADES.map((row, i) => (
              <tr
                key={i}
                className="border-border/40 border-b text-b-4"
              >
                <td className="py-2 pr-6 text-gray">{row.age}</td>
                <td
                  className={cn(
                    "py-2 pr-6 font-medium",
                    row.type === "Buy" ? "text-up" : "text-down",
                  )}
                >
                  {row.type}
                </td>
                <td className="py-2 pr-6 text-white">{row.mc}</td>
                <td className="py-2 pr-6 text-white">{row.amount}</td>
                <td
                  className={cn(
                    "py-2 pr-6",
                    row.type === "Buy" ? "text-up" : "text-down",
                  )}
                >
                  {row.totalUsd}
                </td>
                <td className="py-2 pr-6 text-gray">{row.gas}</td>
                <td className="py-2 pr-6">
                  <span className="flex items-center gap-1.5 text-white">
                    {row.trader}
                    <Pencil className="size-3 text-gray" />
                    <span className="text-gray">2</span>
                  </span>
                </td>
                <td className="py-2 pr-6 text-right text-gray">
                  <Filter className="ml-auto size-3.5" />
                </td>
                <td className="py-2 text-right text-gray">
                  <Eye className="ml-auto size-3.5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
