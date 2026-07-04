import { ArrowUpDown, EyeOff, Share2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { POSITIONS } from "@/lib/mock/portfolio-data";
import { cn } from "@/lib/utils";

const TABS = ["Active positions", "History", "Top 100"] as const;
const COLUMNS = [
  "Token",
  "Bought",
  "Sold",
  "Remaining",
  "PNL",
  "Holding Duration",
  "Action",
] as const;

export function PositionsTable() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active positions");

  return (
    <section>
      <div className="flex items-center gap-6 border-b border-border/70 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-b-2 font-semibold transition-colors",
              tab === t ? "text-primary" : "text-grey hover:text-white/70",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border/70 text-b-3 text-grey">
              {COLUMNS.map((col) => (
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
            {POSITIONS.map((p, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-4 pr-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-indigo-500 text-white">
                        S
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-b-3 font-medium text-white">
                        {p.token}
                      </p>
                      <p className="text-b-5 text-grey">{p.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-6">
                  <p className="text-b-3 font-medium text-up">{p.boughtUsd}</p>
                  <p className="text-b-5 text-grey">{p.boughtAmount}</p>
                </td>
                <td className="py-4 pr-6">
                  <p className="text-b-3 font-medium text-warning">
                    {p.soldUsd}
                  </p>
                  <p className="text-b-5 text-grey">{p.soldAmount}</p>
                </td>
                <td className="py-4 pr-6">
                  <p className="text-b-3 font-medium text-white">
                    {p.remainingUsd}
                  </p>
                  <p className="text-b-5 text-grey">{p.remainingAmount}</p>
                </td>
                <td className="py-4 pr-6">
                  <p className="text-b-3 font-medium text-up">{p.pnlUsd}</p>
                  <p className="text-b-5 text-up">{p.pnlPct}</p>
                </td>
                <td className="py-4 pr-6 text-b-3 text-grey">{p.holding}</td>
                <td className="py-4 pr-6">
                  <div className="flex items-center gap-3 text-grey">
                    <EyeOff className="size-4" />
                    <ArrowUpDown className="size-4" />
                    <Share2 className="size-4" />
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
