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
import { cn, formatCompactNumber } from "@/lib/utils";
import { FishIcon, MouseLabIcon } from "@/components/ui/icons";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";

export const TopHolders = ({ token, children, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders?.top10_holder_pct;
  const value =
    holdersPercent !== null && holdersPercent !== undefined
      ? `${formatCompactNumber(holdersPercent)}%`
      : "N/A";

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent !== null &&
          holdersPercent !== undefined &&
          holdersPercent > 5
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
      {total !== null && total !== undefined
        ? formatCompactNumber(total)
        : "N/A"}
    </InfoBadge>
  );
};

export const InsidersHold = ({ token, ...props }: TokenInfoProps) => {
  const insiderCount = token.insiders?.insider_count;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        insiderCount !== null && insiderCount !== undefined && insiderCount > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Insiders Hold"
          value={
            <span className="text-accent">
              {insiderCount !== null && insiderCount !== undefined
                ? `${formatCompactNumber(insiderCount)}`
                : "N/A"}
            </span>
          }
        />
      }
      {...props}
    >
      <MouseLabIcon />
      {insiderCount !== null && insiderCount !== undefined
        ? `${formatCompactNumber(insiderCount)}`
        : "N/A"}
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
        sniperCount !== null && sniperCount !== undefined && sniperCount > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Snipers Hold"
          value={
            <span className="text-accent">
              {sniperCount !== null && sniperCount !== undefined
                ? `${formatCompactNumber(sniperCount)}`
                : "N/A"}
            </span>
          }
        />
      }
      {...props}
    >
      <LocateFixed />
      {sniperCount !== null && sniperCount !== undefined
        ? `${formatCompactNumber(sniperCount)}`
        : "N/A"}
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
        bundledWalletCount !== null &&
          bundledWalletCount !== undefined &&
          Number(bundledWalletCount) > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <div>
          <InfoBadgeTooltipGrid>
            <InfoBadgeTooltipRow
              label="Bundlers Hold"
              value={
                bundledWalletCount !== null && bundledWalletCount !== undefined
                  ? `${formatCompactNumber(Number(bundledWalletCount))}`
                  : "N/A"
              }
            />

            <InfoBadgeTooltipRow
              label="ATH Hold"
              value="N/A"
            />

            <InfoBadgeTooltipRow
              label="Total bundlers"
              value={
                bundledWalletCount !== null && bundledWalletCount !== undefined
                  ? `${formatCompactNumber(Number(bundledWalletCount))}`
                  : "N/A"
              }
            />

            <InfoBadgeTooltipRow
              label="Bundled total"
              value={
                earlySol !== null && earlySol !== undefined
                  ? `${formatCompactNumber(earlySol)} SOL`
                  : "N/A"
              }
            />

            <InfoBadgeTooltipRow
              label="Bundled token"
              value="N/A"
            />
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <Layers />
      {bundledWalletCount !== null && bundledWalletCount !== undefined
        ? `${formatCompactNumber(Number(bundledWalletCount))}`
        : "N/A"}
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
      {completionPct !== null && completionPct !== undefined
        ? completionPct.toFixed(0)
        : "N/A"}
    </InfoBadge>
  );
};
