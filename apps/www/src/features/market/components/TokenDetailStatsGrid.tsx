import type { TokenFull } from "@rhivadotfun/dataapi";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
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

export function TokenDetailStatsGrid({ token }: { token: TokenFull }) {
  const t = useTranslations("metrics");

  const items = [
    {
      label: t("top10.label"),
      infoBadge: (
        <TopHolders
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("dev.label"),
      infoBadge: (
        <DevHoldOrDevSell
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("totalHolders.label"),
      infoBadge: (
        <TotalHolders
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("snipers.label"),
      infoBadge: (
        <SnipersHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("insiders.label"),
      infoBadge: (
        <InsidersHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("phishing.label"),
      infoBadge: (
        <PhishingsHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("bundlers.label"),
      infoBadge: (
        <BundlersHold
          token={token}
          variant={"inline"}
        />
      ),
    },
    {
      label: t("dex.label"),
      infoBadge: (
        <DexPaid
          token={token}
          variant={"inline"}
        />
      ),
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
