import { useMemo } from "react";
import type { TokenDetail } from "@rhivadotfun/dataapi";
import { CheckCircle2, HelpCircle, Lock } from "lucide-react";

import { AddressCopy } from "./tooltips/TokenInfo";
import { Separator } from "@/components/ui/separator";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { SideRailRow, SideRailSection } from "@/components/ui/side-rail";
import { formatAge } from "@/lib/utils";

export function TokenDetailDataSections({ token }: { token: TokenDetail }) {
  const creator = useMemo(
    () => (token.creator ? token.creator : token.insiders?.creator_wallet),
    [token.creator, token.insiders?.creator_wallet],
  );

  const totalSupply =
    token.price_usd && token.market_cap_usd
      ? token.market_cap_usd / token.price_usd
      : 0;

  const basicDataItems = [
    { label: "Mint", value: <AddressCopy address={token.mint} /> },
    {
      label: "Market cap",
      value: formatCompactCurrency(token.market_cap_usd),
    },
    {
      label: "Holders",
      value: formatCompactNumber(token.holders?.holder_count),
    },
    {
      label: "Total supply",
      value: formatCompactNumber(totalSupply),
    },
    {
      label: "Token last update",
      value: formatAge(token.live?.updated_at),
    },
  ];

  return (
    <div>
      <SideRailSection title="Dynamic BC Pool Info">
        <SideRailRow
          label="Total liq"
          value={
            <div className="flex items-center gap-1">
              {formatCompactCurrency(token.liquidity_usd)}
              <Lock className="size-3 text-muted-foreground" />
            </div>
          }
        />

        <div className="mt-2 grid grid-cols-3 gap-2 text-b-5 text-muted-foreground">
          <span>Pair</span>
          <span>Liq/Initial</span>
          <span className="text-right">Value</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
          <span>{token.symbol}</span>
          <span>{token.liquidity_usd ? "Live" : "N/A"}</span>
          <span className="text-right text-white">
            {formatCompactCurrency(token.liquidity_usd)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
          <span>SOL</span>
          <span className="text-up">
            {`${formatCompactNumber(token.bonding.completion_pct)}%`}
          </span>
          <span className="text-right">
            {formatCompactCurrency(token.liquidity_usd)}
          </span>
        </div>
      </SideRailSection>

      <Separator />

      <SideRailSection title="DEV Info">
        {creator && (
          <SideRailRow
            label="DEV"
            value={<AddressCopy address={creator} />}
          />
        )}
        <SideRailRow
          label="Dev Launched / Migrated"
          value={`N/A / N/A`}
        />
        <SideRailRow
          label="Token Balance"
          value={formatCompactNumber(token.holders?.dev_balance)}
        />
      </SideRailSection>

      <Separator />

      <SideRailSection title="Basic Data">
        {basicDataItems.map((item) => (
          <SideRailRow
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </SideRailSection>

      <Separator />

      <SideRailSection title="Token Audit">
        {[
          { label: "NoMint", ok: true },
          { label: "No Blacklist", ok: true },
          {
            label: "Burnt",
            ok: true,
            value:
              token.bonding?.stage === "completed"
                ? "100%"
                : `${formatCompactNumber(token.bonding.completion_pct)}%`,
          },
          {
            label: "Top 10",
            value: `${formatCompactNumber(token.holders?.top10_holder_pct)}%`,
            warn: true,
          },
        ].map((item) => (
          <SideRailRow
            key={item.label}
            label={item.label}
            value={
              <span className="flex items-center gap-1">
                {item.value}
                {item.warn ? (
                  <HelpCircle className="size-3.5 text-warn" />
                ) : (
                  <CheckCircle2 className="size-3.5 text-up" />
                )}
              </span>
            }
          />
        ))}
      </SideRailSection>
    </div>
  );
}
