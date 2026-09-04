import type { TokenFull } from "@rhivadotfun/dataapi";
import {
  Layers,
  LocateFixed,
  Sprout,
  Trophy,
  Users,
  UserStar,
} from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("metrics.top10");
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
          label={t("tooltip")}
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
  const t = useTranslations("metrics.totalHolders");
  const total = token.holders;
  return (
    <InfoBadge
      tooltip={t("tooltip")}
      {...props}
    >
      <Users />
      {formatCompactNumber(total)}
    </InfoBadge>
  );
};

export const InsidersHold = ({ token, ...props }: TokenInfoProps) => {
  const t = useTranslations("metrics.insiders");
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
          label={t("tooltip")}
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
  const t = useTranslations("metrics.fresh");
  const freshPct = token.intel?.dev?.initial_pct ?? 0;
  return (
    <InfoBadge
      variant={"badge"}
      className="[--accent:var(--color-up)]"
      tooltip={
        <InfoBadgeTooltipRow
          label={t("tooltip")}
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
  const t = useTranslations("metrics.phishing");
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
          label={t("tooltip")}
          value={
            <span className="text-accent">
              {isSuspicious
                ? t("flags", { count: suspiciousFlags.length || 1 })
                : t("clean")}
            </span>
          }
        />
      }
      {...props}
    >
      <FishIcon />
      {isSuspicious ? t("warn") : "0"}
    </InfoBadge>
  );
};

export const SnipersHold = ({ token, ...props }: TokenInfoProps) => {
  const t = useTranslations("metrics.snipers");
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
          label={t("tooltip")}
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
  const t = useTranslations("metrics.bundlers");
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
              label={t("tooltip")}
              value={formatCompactNumber(bundledWalletCount)}
            />

            <InfoBadgeTooltipRow
              label={t("athHold")}
              value={formatCompactCurrency(token.ath_mcap_usd)}
            />

            <InfoBadgeTooltipRow
              label={t("total")}
              value={formatCompactNumber(bundledWalletCount)}
            />

            <InfoBadgeTooltipRow
              label={t("bundledTotal")}
              value={`${formatCompactNumber(earlySol)} SOL`}
            />

            <InfoBadgeTooltipRow
              label={t("bundledToken")}
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
  const t = useTranslations("metrics.kol");
  const completionPct = getTokenBondingPct(token);
  return (
    <InfoBadge
      tooltip={t("tooltip")}
      {...props}
    >
      <Trophy />
      {`${formatCompactNumber(completionPct)}%`}
    </InfoBadge>
  );
};
