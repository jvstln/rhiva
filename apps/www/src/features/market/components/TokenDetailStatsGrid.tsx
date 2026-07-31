import type { Token } from "@/features/market/market.token.type";
import { cn } from "@/lib/utils";
import {
  BundlersHold,
  InsidersHold,
  PhishingsHold,
  SnipersHold,
  TopHolders,
  TotalHolders,
} from "./tooltips/Holders";
import { DevHoldOrDevSell } from "./tooltips/DevInfo";
import { DexPaid } from "./tooltips/DexInfo";

export function TokenDetailStatsGrid({ token }: { token: Token }) {
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
      label: "Burnt",

      value: token.bonding?.stage === "completed" ? "100%" : "N/A",
    },
    {
      label: "Rug %",
      value:
        token.bot_activity !== undefined
          ? `${token.bot_activity.toFixed(0)}%`
          : "N/A",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-2",
        "**:data-[slot=info-badge]:text-sm **:data-[slot=info-badge]:[&_svg]:size-4",
      )}
    >
      {items.map((item) => {
        if (!item.infoBadge) return null;

        return (
          <div
            key={item.label}
            className="flex flex-col items-start gap-1 p-4"
          >
            <p className="text-gray text-xs">{item.label}</p>
            {item.infoBadge}
          </div>
        );
      })}
    </div>
  );
}
