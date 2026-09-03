import type { TokenFull } from "@rhivadotfun/dataapi";
import {
  Layers,
  LocateFixed,
  Sprout,
  Trophy,
  Users,
  UserStar,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { TokenInfoProps } from "./TokenInfo";
import { getTokenBondingPct } from "../../market.schema";
import { FishIcon, MouseLabIcon } from "@/components/ui/icons";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";

export const TopHolders = ({ token, children, ...props }: TokenInfoProps) => {
  const holdersPercent = token.top10_pct;
  const value = `${formatCompactNumber(holdersPercent)}%`;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent != null && holdersPercent > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Top 10 Holders"
          value={<span className="text-accent">{value}</span>}
        />
      }
      {...props}
    >
      {children ? (
        children({ value, icon: UserStar })
      ) : (
        <>
          <UserStar />
          {value}
        </>
      )}
    </InfoBadge>
  );
};

export const TotalHolders = ({ token, ...props }: TokenInfoProps) => {
  const total = token.holders;
  return (
    <InfoBadge
      tooltip={"Total holders"}
      {...props}
    >
      <Users />
      {formatCompactNumber(total)}
    </InfoBadge>
  );
};

export const InsidersHold = ({ token, ...props }: TokenInfoProps) => {
  const insiderCount = token.intel?.insiders?.wallets;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        insiderCount != null && insiderCount > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Insiders Hold"
          value={
            <span className="text-accent">
              {formatCompactNumber(insiderCount)}
            </span>
          }
        />
      }
      {...props}
    >
      <MouseLabIcon />
      {formatCompactNumber(insiderCount)}
    </InfoBadge>
  );
};

export const FreshHold = ({ token, ...props }: TokenInfoProps) => {
  const freshPct = token.intel?.dev?.initial_pct ?? 0;
  return (
    <InfoBadge
      variant={"badge"}
      className="[--accent:var(--color-up)]"
      tooltip={
        <InfoBadgeTooltipRow
          label="Fresh / Dev Initial"
          value={
            <span className="text-accent">
              {formatCompactNumber(freshPct)}%
            </span>
          }
        />
      }
      {...props}
    >
      <Sprout />
      {`${formatCompactNumber(freshPct)}%`}
    </InfoBadge>
  );
};

export const PhishingsHold = ({ token, ...props }: TokenInfoProps) => {
  const suspiciousFlags =
    token.intel?.flags?.filter(
      (f) =>
        f.name.toLowerCase().includes("phish") ||
        f.detail.toLowerCase().includes("phish"),
    ) ?? [];
  const isSuspicious =
    suspiciousFlags.length > 0 || (token.intel?.rugged ?? false);

  return (
    <InfoBadge
      variant={"badge"}
      className={
        isSuspicious
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]"
      }
      tooltip={
        <InfoBadgeTooltipRow
          label="Phishing / Malicious Flags"
          value={
            <span className="text-accent">
              {isSuspicious ? `${suspiciousFlags.length || 1} Flags` : "Clean"}
            </span>
          }
        />
      }
      {...props}
    >
      <FishIcon />
      {isSuspicious ? "Warn" : "0"}
    </InfoBadge>
  );
};

export const SnipersHold = ({ token, ...props }: TokenInfoProps) => {
  const sniperCount = token.intel?.snipers?.wallets;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        sniperCount != null && sniperCount > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Snipers Hold"
          value={
            <span className="text-accent">
              {formatCompactNumber(sniperCount)}
            </span>
          }
        />
      }
      {...props}
    >
      <LocateFixed />
      {formatCompactNumber(sniperCount)}
    </InfoBadge>
  );
};

export const BundlersHold = ({ token, ...props }: TokenInfoProps) => {
  const bundledWalletCount = token.intel?.bundlers?.wallets;
  const earlySol = token.intel?.bundlers?.held;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        bundledWalletCount != null && Number(bundledWalletCount) > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <div>
          <InfoBadgeTooltipGrid>
            <InfoBadgeTooltipRow
              label="Bundlers Hold"
              value={formatCompactNumber(bundledWalletCount)}
            />

            <InfoBadgeTooltipRow
              label="ATH Hold"
              value={formatCompactCurrency(token.ath_mcap_usd)}
            />

            <InfoBadgeTooltipRow
              label="Total bundlers"
              value={formatCompactNumber(bundledWalletCount)}
            />

            <InfoBadgeTooltipRow
              label="Bundled total"
              value={`${formatCompactNumber(earlySol)} SOL`}
            />

            <InfoBadgeTooltipRow
              label="Bundled token"
              value={formatCompactNumber(token.intel?.bundlers?.held)}
            />
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <Layers />
      {formatCompactNumber(bundledWalletCount)}
    </InfoBadge>
  );
};

export const KolHold = ({ token, ...props }: { token: TokenFull }) => {
  const completionPct = getTokenBondingPct(token);
  return (
    <InfoBadge
      tooltip="KOL Hold"
      {...props}
    >
      <Trophy />
      {`${formatCompactNumber(completionPct)}%`}
    </InfoBadge>
  );
};
