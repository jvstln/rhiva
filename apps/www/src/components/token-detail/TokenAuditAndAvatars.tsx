import { CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import type { Token } from "@/features/market/market.token.type";
import { TokenThumbnail } from "@/features/market/components/TokenThumbnail";

import { InfoRow, InfoSection } from "./InfoSection";

type TokenAuditCardProps = { token: Token };

type AvatarItem = { name: string; wallet: string; mc: string; age: string };

export function TokenAuditCard({ token }: TokenAuditCardProps) {
  const auditRows = [
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
        token.holders?.top10_holder_pct !== undefined
          ? `${token.holders.top10_holder_pct.toFixed(0)}%`
          : "N/A",
      warn: true,
    },
  ];

  return (
    <InfoSection title="Token Audit">
      {auditRows.map((row) => (
        <InfoRow
          key={row.label}
          label={row.label}
          value={
            <span className="flex items-center gap-1">
              {row.value}
              {row.warn ? (
                <HelpCircle className="size-3.5 text-warn" />
              ) : (
                <CheckCircle2 className="size-3.5 text-up" />
              )}
            </span>
          }
        />
      ))}
      <div className="mt-3 flex items-center gap-1.5 font-medium text-b-3 text-white">
        <Sparkles className="size-4 text-primary" />
        GoPlus
      </div>
    </InfoSection>
  );
}

export function AvatarReusedCard({ items }: { items: AvatarItem[] }) {
  return (
    <InfoSection
      title="Avatar Reused Tokens"
      aside={<span>MC</span>}
    >
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.wallet}
            className="flex items-center gap-2"
          >
            <TokenThumbnail
              badge={undefined}
              className="size-8"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-b-4 text-white">
                {item.name}
              </p>
              <p className="truncate text-b-5 text-gray">{item.wallet}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-b-4 text-primary">{item.mc}</p>
              <p className="text-b-5 text-gray">{item.age}</p>
            </div>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
