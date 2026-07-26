import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import type { Token } from "../../market.token.type";
import { cn, formatCompactNumber } from "@/lib/utils";
import { Layers, LocateFixed, Users, UserStar } from "lucide-react";
import { FishIcon, MouseLabIcon } from "@/components/ui/icons";

type HoldersProps = { token: Token };

export const TopHolders = ({ token }: HoldersProps) => {
  const holdersPercent = token.holders.top10;

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
    >
      <UserStar />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const TotalHolders = ({ token }: { token: Token }) => {
  return (
    <InfoBadge tooltip={"Total holders"}>
      <Users />
      {formatCompactNumber(token.holders.total)}
    </InfoBadge>
  );
};

export const InsidersHold = ({ token }: HoldersProps) => {
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
    >
      <MouseLabIcon />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const PhishingsHold = ({ token }: HoldersProps) => {
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
    >
      <FishIcon />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};
export const SnipersHold = ({ token }: HoldersProps) => {
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
    >
      <LocateFixed />
      {`${formatCompactNumber(holdersPercent)}%`}
    </InfoBadge>
  );
};

export const BundlersHold = ({ token }: HoldersProps) => {
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
    >
      <Layers />
      {`${formatCompactNumber(token.holders.totalBundlers)}%`}
    </InfoBadge>
  );
};
