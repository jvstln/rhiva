import type { TokenFull } from "@rhivadotfun/dataapi";
import { ChefHat, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn, formatAge } from "@/lib/utils";
import type { TokenInfoProps } from "./TokenInfo";
import { getTokenBondingPct } from "../../market.schema";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipHeader,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";

export const DevHoldOrDevSell = ({ token, ...props }: TokenInfoProps) => {
  const t = useTranslations("metrics.dev");
  const hasIntelDev = token.intel?.dev != null;
  const devHoldPercent = hasIntelDev
    ? token.intel!.dev.held_pct
    : (token.screener?.dev_pct ?? null);
  const hasDevSoldAll = hasIntelDev ? devHoldPercent === 0 : false;
  const devWallet = token.creator || token.dev?.wallet;
  const _funderWallet = null;

  const boughtTokens = token.intel?.dev?.initial;
  const devInitialUsd =
    boughtTokens != null && token.price_usd
      ? boughtTokens * token.price_usd
      : null;
  const devBalance = token.intel?.dev?.held;

  const soldTokens =
    boughtTokens != null && devBalance != null
      ? Math.max(0, boughtTokens - devBalance)
      : null;

  const lastUpdateMs = token.created_time
    ? Number(token.created_time)
    : Date.now();

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        hasDevSoldAll
          ? "[--accent:var(--color-up)]"
          : "[--accent:var(--color-down)]",
      )}
      tooltip={
        <div>
          <InfoBadgeTooltipGrid>
            <InfoBadgeTooltipHeader>
              {hasDevSoldAll ? t("sold") : t("hold")}&nbsp;
              {formatCompactNumber(devHoldPercent)}%
            </InfoBadgeTooltipHeader>

            {devWallet && (
              <InfoBadgeTooltipRow
                label={t("label")}
                value={`${devWallet.slice(0, 4)}...${devWallet.slice(-4)}`}
              />
            )}

            {boughtTokens != null && (
              <InfoBadgeTooltipRow
                label={t("bought")}
                value={
                  <span className="flex items-center gap-1">
                    {formatCompactNumber(boughtTokens)}
                    {devInitialUsd != null && (
                      <span className="flex items-center text-muted-foreground text-xs">
                        ({formatCompactCurrency(devInitialUsd)})
                      </span>
                    )}
                  </span>
                }
              />
            )}

            {soldTokens != null && (
              <InfoBadgeTooltipRow
                label={t("sold")}
                value={formatCompactNumber(soldTokens)}
              />
            )}

            {devBalance != null && (
              <InfoBadgeTooltipRow
                label={t("balance")}
                value={formatCompactNumber(devBalance)}
              />
            )}

            {lastUpdateMs && (
              <InfoBadgeTooltipRow
                label={t("lastTrade")}
                value={formatAge(lastUpdateMs)}
              />
            )}
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <ChefHat />
      {props.children
        ? props.children
        : hasDevSoldAll
          ? t("ds")
          : devHoldPercent != null
            ? `${formatCompactNumber(devHoldPercent)}%`
            : "--"}
    </InfoBadge>
  );
};

export const DevMigratedAndLaunch = ({ token }: { token: TokenFull }) => {
  const t = useTranslations("metrics.dev");
  const isMigrated = token.screener?.is_graduated ?? false;
  const bondingPct = getTokenBondingPct(token);
  const statusLabel = isMigrated
    ? t("completed")
    : `${formatCompactNumber(bondingPct)}%`;

  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipGrid>
          <InfoBadgeTooltipRow
            label={t("migrated")}
            value={isMigrated ? t("yes") : t("no")}
          />
          <InfoBadgeTooltipRow
            label={t("launched")}
            value={formatAge(token.created_time)}
          />
          <InfoBadgeTooltipRow
            label={t("migrated")}
            value={statusLabel}
          />
        </InfoBadgeTooltipGrid>
      }
    >
      <Crown />
      {statusLabel}
    </InfoBadge>
  );
};

export const CashbackNotice = ({ token: _token }: { token: TokenFull }) => {
  return null;
};
