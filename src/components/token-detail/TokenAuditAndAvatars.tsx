import { CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import type { AVATAR_REUSED } from "@/data/token-detail-data";
import { TokenThumbnail } from "@/features/market/components/TokenThumbnail";

import { InfoRow, InfoSection } from "./InfoSection";

const AUDIT_ROWS = [
  { label: "NoMint", ok: true },
  { label: "No Blacklist", ok: true },
  { label: "Burnt", ok: true },
  { label: "Top 10", value: "99%", warn: true },
];

export function TokenAuditCard() {
  return (
    <InfoSection title="Token Audit">
      {AUDIT_ROWS.map((row) => (
        <InfoRow
          key={row.label}
          label={row.label}
          value={
            <span className="flex items-center gap-1">
              {row.value}
              {row.warn ? (
                <HelpCircle className="size-3.5 text-warning" />
              ) : (
                <CheckCircle2 className="size-3.5 text-up" />
              )}
            </span>
          }
        />
      ))}
      <div className="mt-3 flex items-center gap-1.5 text-b-3 font-medium text-white">
        <Sparkles className="size-4 text-primary" />
        GoPlus
      </div>
    </InfoSection>
  );
}

export function AvatarReusedCard({ items }: { items: typeof AVATAR_REUSED }) {
  return (
    <InfoSection title="Avatar Reused Tokens" aside={<span>MC</span>}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <TokenThumbnail badge={undefined} className="size-8" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-b-4 font-medium text-white">
                {item.name}
              </p>
              <p className="truncate text-b-5 text-gray">{item.wallet}</p>
            </div>
            <div className="text-right">
              <p className="text-b-4 font-medium text-primary">{item.mc}</p>
              <p className="text-b-5 text-gray">{item.age}</p>
            </div>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
