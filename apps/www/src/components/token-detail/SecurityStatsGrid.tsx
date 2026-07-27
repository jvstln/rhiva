import { CheckCircle2 } from "lucide-react";
import type { Token } from "@/features/market/market.token.type";
import { cn } from "@/lib/utils";

type SecurityStatsGridProps = { token: Token };

function StatGrid(props: {
  items: readonly { label: string; value: string; tone?: "down" | "warning" }[];
}) {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3">
      {props.items.map((item) => (
        <div key={item.label}>
          <p className="text-b-5 text-gray">{item.label}</p>
          <p
            className={cn(
              "font-semibold text-b-3",
              item.tone === "down" && "text-down",
              item.tone === "warning" && "text-warn",
              !item.tone && "text-white",
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(0)}%`;
}

export function SecurityStatsGrid({ token }: SecurityStatsGridProps) {
  const primaryItems = [
    {
      label: "Top 10",
      value: formatPercent(token.holders?.top10),
      tone: token.holders?.top10 !== undefined ? undefined : "warning",
    },
    {
      label: "DEV",
      value: formatPercent(token.holders?.dev_holder_pct),
      tone: token.holders?.dev_holder_pct !== undefined ? undefined : "warning",
    },
    {
      label: "Holders",
      value:
        token.holders?.total !== undefined ? `${token.holders.total}` : "N/A",
    },
    {
      label: "Snipers",
      value:
        token.sniper_holdings !== undefined
          ? `${token.sniper_holdings}`
          : "N/A",
      tone: token.sniper_holdings !== undefined ? "down" : undefined,
    },
  ] as const;

  const secondaryItems = [
    { label: "Insiders", value: formatPercent(token.holders?.dev_holder_pct) },
    {
      label: "Phishing",
      value:
        token.bot_activity !== undefined
          ? `${token.bot_activity.toFixed(0)}%`
          : "N/A",
    },
    {
      label: "Bundler",
      value:
        token.bundled_supply !== undefined ? `${token.bundled_supply}` : "N/A",
    },
    {
      label: "Dex Paid",
      value: token.live?.has_paid_order ? "Paid" : "Unpaid",
      tone: token.live?.has_paid_order ? undefined : "down",
    },
  ] as const;

  const auditItems = [
    { label: "NoMint", ok: true, value: "" },
    { label: "No Blacklist", ok: true, value: "" },
    {
      label: "Burnt",
      ok: true,
      value: token.bonding?.stage === "completed" ? "100%" : "N/A",
    },
    {
      label: "Rug %",
      ok: token.bot_activity !== undefined && token.bot_activity <= 0,
      value:
        token.bot_activity !== undefined
          ? `${token.bot_activity.toFixed(0)}%`
          : "N/A",
    },
  ];

  return (
    <div className="border-border/70 border-t">
      <StatGrid items={primaryItems} />
      <StatGrid items={secondaryItems} />
      <div className="grid grid-cols-4 gap-2 px-4 pb-3">
        {auditItems.map((item) => (
          <div key={item.label}>
            <p className="text-b-5 text-gray">{item.label}</p>
            <p className="flex items-center gap-1 font-semibold text-b-3 text-white">
              {item.value}
              {item.ok && <CheckCircle2 className="size-3.5 text-up" />}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
