import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Token } from "../market.token.type";
import type { ReactNode } from "react";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { CheckCircle2, ChevronDown, HelpCircle, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AddressCopy } from "./tooltips/TokenInfo";

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

export function TokenDetailDataSections({ token }: { token: Token }) {
  const basicDataItems = [
    { label: "Mint", value: <AddressCopy address={token.mint} /> },
    { label: "Market cap", value: formatCompactCurrency(token.marketCapUsd) },
    { label: "Holders", value: token.holders.total },
    { label: "Total supply", value: token.totalSupply },
    { label: "Token last update", value: token.updatedAt.toLocaleString() },
  ];

  return (
    <div>
      <Section title="Dynamic BC Pool Info">
        <Row
          label="Total liq"
          value={
            <div className="flex items-center gap-1">
              {formatCompactCurrency(token.liquidityUsd)}
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
          <span>{token.liquidityUsd ? "Live" : "N/A"}</span>
          <span className="text-right text-white">
            {formatCompactCurrency(token.liquidityUsd)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
          <span>SOL</span>
          <span className="text-up">N/A</span>
          <span className="text-right">
            {formatCompactCurrency(token.liquidityUsd)}
          </span>
        </div>
      </Section>

      <Separator />

      <Section title="DEV Info">
        {token.dev.address && (
          <Row
            label="DEV"
            value={<AddressCopy address={token.dev.address} />}
          />
        )}
        <Row
          label="Dev Launched / Migrated"
          value={`${formatCompactNumber(token.dev.launched)} / ${formatCompactNumber(token.dev.migrated)}`}
        />
        <Row
          label="Token Balance"
          value={formatCompactNumber(token.dev.tokenBalance)}
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
              token.holders?.top10 !== undefined
                ? `${token.holders.top10.toFixed(0)}%`
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
