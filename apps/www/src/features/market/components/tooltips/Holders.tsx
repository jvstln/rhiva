import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import type { Token } from "../../market.token.type";
import { cn, formatCompactNumber } from "@/lib/utils";
import {
  Layers,
  LocateFixed,
  Sprout,
  Trophy,
  Users,
  UserStar,
} from "lucide-react";
import { FishIcon, MouseLabIcon } from "@/components/ui/icons";
import type { TokenInfoProps } from "./TokenInfo";

export const TopHolders = ({ token, children, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders.top10;
  const value = `${formatCompactNumber(holdersPercent)}%`;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Top 10 Holders"
          value={
            <span className="text-accent">
              {`${formatCompactNumber(holdersPercent)}%`}
            </span>
          }
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
  return (
    <InfoBadge
      tooltip={"Total holders"}
      {...props}
    >
      <Users />
      {formatCompactNumber(token.holders.total)}
    </InfoBadge>
  );
};

export const InsidersHold = ({ token, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders.insiders;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Insiders Hold"
          value={
            <span className="text-accent">
              {`${formatCompactNumber(holdersPercent)}%`}
            </span>
          }
        />
      }
      {...props}
    >
      <MouseLabIcon />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const FreshHold = ({ token, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders.fresh;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Fresh Hold"
          value={
            <span className="text-accent">
              {`${formatCompactNumber(holdersPercent)}%`}
            </span>
          }
        />
      }
      {...props}
    >
      <Sprout />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const PhishingsHold = ({ token, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders.phishings;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Phishings Hold"
          value={
            <span className="text-accent">
              {`${formatCompactNumber(holdersPercent)}%`}
            </span>
          }
        />
      }
      {...props}
    >
      <FishIcon />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const SnipersHold = ({ token, ...props }: TokenInfoProps) => {
  const holdersPercent = token.holders.snipers;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        holdersPercent > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Snipers Hold"
          value={
            <span className="text-accent">
              {`${formatCompactNumber(holdersPercent)}%`}
            </span>
          }
        />
      }
      {...props}
    >
      <LocateFixed />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const BundlersHold = ({ token, ...props }: TokenInfoProps) => {
  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        token.holders.bundlers > 5
          ? "[--accent:var(--color-down)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <div>
          <InfoBadgeTooltipGrid>
            <InfoBadgeTooltipRow
              label="Bundlers Hold"
              value={`${formatCompactNumber(token.holders.bundlers)}%`}
            />

            <InfoBadgeTooltipRow
              label="ATH Hold"
              value={`${formatCompactNumber(token.holders.bundlers)}%`}
            />

            <InfoBadgeTooltipRow
              label="Total bundlers"
              value={`${formatCompactNumber(token.holders.totalBundlers)}%`}
            />

            {
              <InfoBadgeTooltipRow
                label="Bundled total"
                value={`${formatCompactNumber(token.holders.bundledTotal)} ${token.symbol ?? ""}`}
              />
            }

            {token.holders.bundledToken !== undefined ? (
              <InfoBadgeTooltipRow
                label="Bundled token"
                value={`${formatCompactNumber(token.holders.bundledToken)}%`}
              />
            ) : null}
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <Layers />
      {`${formatCompactNumber(token.holders.totalBundlers)}%`}
    </InfoBadge>
  );
};

export const KolHold = ({ token, ...props }: { token: Token }) => {
  return (
    <InfoBadge
      tooltip="KOL Hold"
      {...props}
    >
      <Trophy />
      {(token.bonding?.bondingPct ?? 0).toFixed(0)}
    </InfoBadge>
  );
};
