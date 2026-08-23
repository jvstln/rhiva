import type { TokenDetail } from "@rhivadotfun/dataapi";

import { cn, formatCompactNumber } from "@/lib/utils";
import { DexPaid } from "./tooltips/DexInfo";
import { DevHoldOrDevSell } from "./tooltips/DevInfo";
import {
  BundlersHold,
  InsidersHold,
  PhishingsHold,
  SnipersHold,
  TopHolders,
  TotalHolders,
} from "./tooltips/Holders";

export function TokenDetailStatsGrid({ token }: { token: TokenDetail }) {
  const items = [
    {
      label: "Top 10",
      infoBadge: (
        <TopHolders
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "DEV",
      infoBadge: (
        <DevHoldOrDevSell
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "Holders",
      infoBadge: (
        <TotalHolders
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "Snipers",
      infoBadge: (
        <SnipersHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "Insiders",
      infoBadge: (
        <InsidersHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "Phishing",
      infoBadge: (
        <PhishingsHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "Bundler",
      infoBadge: (
        <BundlersHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: "Dex Paid",
      infoBadge: (
        <DexPaid
          token={token}
          variant={"inline"}
        />
      ),
    },

    // Unknown properties
    { label: "NoMint", value: "" },
    { label: "No Blacklist", value: "" },
    {
      label: "Rug %",
      value: `${formatCompactNumber(token.bot_activity ? token.bot_activity * 100 : null)}%`,
    },
    {
      label: "Top 10",
      value: `${formatCompactNumber(token.holders?.top10_holder_pct)}%`,
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-4",
        "**:data-[slot=info-badge]:text-sm **:data-[slot=info-badge]:[&_svg]:size-4",
      )}
    >
      {items.map((item) => {
        if (!item.infoBadge) return null;

        return (
          <div
            key={item.label}
            className="flex flex-col items-start gap-1 p-2 sm:p-4"
          >
            <p className="whitespace-nowrap text-gray text-xs">{item.label}</p>
            {item.infoBadge}
          </div>
        );
      })}
    </div>
  );
}
