import { useMemo } from "react";
import type { TokenFull } from "@rhivadotfun/dataapi";
import { CheckCircle2, HelpCircle, Lock, AlertTriangle } from "lucide-react";

import { AddressCopy } from "./tooltips/TokenInfo";
import { Separator } from "@/components/ui/separator";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { SideRailRow, SideRailSection } from "@/components/ui/side-rail";
import { formatAge } from "@/lib/utils";
import {
  useTokenDevHistory,
  useTokenPools,
  useTokenSecurity,
} from "../market.hook";
import { getTokenBondingPct } from "../market.schema";

export function TokenDetailDataSections({ token }: { token: TokenFull }) {
  const devHistory = useTokenDevHistory(token.mint);
  const security = useTokenSecurity(token.mint);
  const poolsQuery = useTokenPools(token.mint);

  const dbcPool = poolsQuery.data?.find(
    (p) => p.dex === "meteora_dbc" || p.dex?.toLowerCase().includes("dbc"),
  );

  const creator = useMemo(
    () =>
      devHistory.data?.creator ||
      token.creator ||
      token.dev?.wallet ||
      undefined,
    [devHistory.data?.creator, token.creator, token.dev?.wallet],
  );

  const devLaunched =
    devHistory.data?.tokens_launched ?? token.dev?.tokens_launched ?? 0;
  const devMigrated = devHistory.data?.migrated ?? 0;
  const bondingPct = getTokenBondingPct(token);

  const totalSupply =
    token.supply ||
    (token.price_usd && token.market_cap_usd
      ? token.market_cap_usd / token.price_usd
      : 0);

  const basicDataItems = [
    { label: "Mint", value: <AddressCopy address={token.mint} /> },
    {
      label: "Market cap",
      value: formatCompactCurrency(token.market_cap_usd),
    },
    {
      label: "Holders",
      value: formatCompactNumber(token.holders),
    },
    {
      label: "Total supply",
      value: formatCompactNumber(totalSupply),
    },
    {
      label: "Token last update",
      value: formatAge(token.created_time),
    },
  ];

  const noMint = security.data ? security.data.mint_authority == null : true;
  const noFreeze = security.data
    ? security.data.freeze_authority == null
    : true;
  const top10Pct = security.data?.top10_pct ?? token.top10_pct;

  return (
    <div>
      {dbcPool && (
        <>
          <SideRailSection title="Dynamic BC Pool Info">
            <SideRailRow
              label="Pool"
              value={<AddressCopy address={dbcPool.pool} />}
            />
            <SideRailRow
              label="Total liq"
              value={
                <div className="flex items-center gap-1">
                  {formatCompactCurrency(
                    dbcPool.liquidity_usd || dbcPool.tvl_usd,
                  )}
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
              <span>{dbcPool.base_usd ? "Live" : "N/A"}</span>
              <span className="text-right text-white">
                {formatCompactCurrency(dbcPool.base_usd)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
              <span>SOL</span>
              <span className="text-up">
                {dbcPool.lp_burn_pct != null
                  ? `${formatCompactNumber(dbcPool.lp_burn_pct)}%`
                  : `${formatCompactNumber(bondingPct)}%`}
              </span>
              <span className="text-right">
                {formatCompactCurrency(dbcPool.quote_usd)}
              </span>
            </div>
          </SideRailSection>

          <Separator />
        </>
      )}

      <SideRailSection title="DEV Info">
        {creator && (
          <SideRailRow
            label="DEV"
            value={<AddressCopy address={creator} />}
          />
        )}
        <SideRailRow
          label="Dev Launched / Migrated"
          value={`${devLaunched} / ${devMigrated}`}
        />
        <SideRailRow
          label="Token Balance"
          value={formatCompactNumber(token.intel?.dev?.held ?? 0)}
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
          {
            label: "NoMint",
            ok: noMint,
            value: noMint ? "Enabled" : "Mintable",
            warn: !noMint,
          },
          {
            label: "No Blacklist",
            ok: noFreeze,
            value: noFreeze ? "Enabled" : "Freezeable",
            warn: !noFreeze,
          },
          {
            label: "Burnt",
            ok: true,
            value: token.screener?.is_graduated
              ? "100%"
              : `${formatCompactNumber(bondingPct)}%`,
          },
          {
            label: "Top 10",
            value: `${formatCompactNumber(top10Pct)}%`,
            warn: top10Pct > 30,
            ok: top10Pct <= 30,
          },
          ...(security.data?.metadata_mutable != null
            ? [
                {
                  label: "Mutable",
                  value: security.data.metadata_mutable ? "Yes" : "No",
                  ok: !security.data.metadata_mutable,
                  warn: security.data.metadata_mutable,
                },
              ]
            : []),
          ...(token.intel
            ? [
                {
                  label: "Rug Risk",
                  value: token.intel.rugged
                    ? "RUGGED"
                    : `${token.intel.score}/100`,
                  warn: token.intel.rugged || token.intel.score >= 10,
                  ok: !token.intel.rugged && token.intel.score < 5,
                },
                ...(token.intel.flags && token.intel.flags.length > 0
                  ? [
                      {
                        label: "Risk Flags",
                        value: `${token.intel.flags.length} warning(s)`,
                        warn: true,
                      },
                    ]
                  : [
                      {
                        label: "Risk Flags",
                        value: "Clean",
                        ok: true,
                      },
                    ]),
              ]
            : []),
          ...(security.data?.total_tax_pct != null
            ? [
                {
                  label: "Tax",
                  value: `${formatCompactNumber(security.data.total_tax_pct)}%`,
                  ok: security.data.total_tax_pct === 0,
                  warn: security.data.total_tax_pct > 0,
                },
              ]
            : []),
        ].map((item) => (
          <SideRailRow
            key={item.label}
            label={item.label}
            value={
              <span className="flex items-center gap-1">
                {item.value}
                {item.warn ? (
                  <AlertTriangle className="size-3.5 text-warn" />
                ) : item.ok ? (
                  <CheckCircle2 className="size-3.5 text-up" />
                ) : (
                  <HelpCircle className="size-3.5 text-muted-foreground" />
                )}
              </span>
            }
          />
        ))}
      </SideRailSection>
    </div>
  );
}
