import { useMemo, type ReactNode } from "react";
import type { TokenDetail } from "@rhivadotfun/dataapi";
import { CheckCircle2, ChevronDown, HelpCircle, Lock } from "lucide-react";

import { AddressCopy } from "./tooltips/TokenInfo";
import { Separator } from "@/components/ui/separator";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Section({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <Collapsible className="px-4 py-3">
      <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between">
        <h3 className="mr-auto font-semibold text-b-2 text-white">{title}</h3>
        <ChevronDown className="size-4 transition-transform [[data-panel-open]_*]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

function Row({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-b-4">
      <span className="text-gray">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function TokenDetailDataSections({ token }: { token: TokenDetail }) {
  const creator = useMemo(
    () => (token.creator ? token.creator : token.insiders?.creator_wallet),
    [token.creator, token.insiders?.creator_wallet],
  );

  const basicDataItems = [
    { label: "Mint", value: <AddressCopy address={token.mint} /> },
    {
      label: "Market cap",
      value:
        token.market_cap_usd !== null && token.market_cap_usd !== undefined
          ? formatCompactCurrency(token.market_cap_usd)
          : "N/A",
    },
    { label: "Holders", value: token.holders?.holder_count ?? "N/A" },
    { label: "Total supply", value: "N/A" },
    {
      label: "Token last update",
      value: token.live.updated_at
        ? new Date(Number(token.live.updated_at)).toLocaleString()
        : "N/A",
    },
  ];

  return (
    <div>
      <Section title="Dynamic BC Pool Info">
        <Row
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
          <span className="text-up">N/A</span>
          <span className="text-right">
            {formatCompactCurrency(token.liquidity_usd)}
          </span>
        </div>
      </Section>

      <Separator />

      <Section title="DEV Info">
        {creator && (
          <Row
            label="DEV"
            value={<AddressCopy address={creator} />}
          />
        )}
        <Row
          label="Dev Launched / Migrated"
          value={`N/A / N/A`}
        />
        <Row
          label="Token Balance"
          value={
            token.holders?.dev_balance !== undefined &&
            token.holders?.dev_balance !== null
              ? formatCompactNumber(token.holders.dev_balance)
              : "N/A"
          }
        />
      </Section>

      <Separator />

      <Section title="Basic Data">
        {basicDataItems.map((item) => (
          <Row
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </Section>

      <Separator />

      <Section title="Token Audit">
        {[
          { label: "NoMint", ok: true },
          { label: "No Blacklist", ok: true },
          {
            label: "Burnt",
            ok: true,
            value: token.bonding?.stage === "completed" ? "100%" : "N/A",
          },
          {
            label: "Top 10",
            value:
              token.holders?.top10_holder_pct !== undefined &&
              token.holders?.top10_holder_pct !== null
                ? `${token.holders.top10_holder_pct.toFixed(2)}%`
                : "N/A",
            warn: true,
          },
        ].map((item) => (
          <Row
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
      </Section>
    </div>
  );
}
