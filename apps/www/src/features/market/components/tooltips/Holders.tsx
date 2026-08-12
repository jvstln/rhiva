import type { TokenDetail } from "@rhivadotfun/dataapi";
import {
  Layers,
  LocateFixed,
  Sprout,
  Trophy,
  Users,
  UserStar,
} from "lucide-react";

import type { TokenInfoProps } from "./TokenInfo";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import { FishIcon, MouseLabIcon } from "@/components/ui/icons";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";

export const TopHolders = ({ token, children, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders?.top10_holder_pct;
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
  const total = token.holders?.holder_count;
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
  const insiderCount = token.insiders?.insider_count;

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
  return (
    <InfoBadge
      variant={"badge"}
      className="[--accent:var(--color-up)]"
      tooltip={
        <InfoBadgeTooltipRow
          label="Fresh Hold"
          value={<span className="text-accent">N/A</span>}
        />
      }
      {...props}
    >
      <Sprout />
      N/A
    </InfoBadge>
  );
};

export const PhishingsHold = ({ token, ...props }: TokenInfoProps) => {
  return (
    <InfoBadge
      variant={"badge"}
      className="[--accent:var(--color-up)]"
      tooltip={
        <InfoBadgeTooltipRow
          label="Phishings Hold"
          value={<span className="text-accent">N/A</span>}
        />
      }
      {...props}
    >
      <FishIcon />
      N/A
    </InfoBadge>
  );
};

export const SnipersHold = ({ token, ...props }: TokenInfoProps) => {
  const sniperCount = token.snipers?.sniper_count;

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
  const bundledWalletCount = token.bundlers?.bundled_wallet_count;
  const earlySol = token.bundlers?.total_early_sol;

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
              value={formatCompactCurrency(token.all_time_high_market_cap_usd)}
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
              value={formatCompactNumber(token.bundled_supply)}
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

export const KolHold = ({ token, ...props }: { token: TokenDetail }) => {
  const completionPct = token.bonding?.completion_pct;
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
