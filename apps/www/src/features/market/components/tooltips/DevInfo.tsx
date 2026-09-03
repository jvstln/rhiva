import type { TokenFull } from "@rhivadotfun/dataapi";
import { ChefHat, Crown } from "lucide-react";

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
  const devHoldPercent = token.intel?.dev?.held_pct ?? 0;
  const hasDevSoldAll = devHoldPercent === 0;
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
              {hasDevSoldAll ? "Dev Sold" : "Dev Hold"}{" "}
              {formatCompactNumber(devHoldPercent)}%
            </InfoBadgeTooltipHeader>

            {devWallet && (
              <InfoBadgeTooltipRow
                label="Dev"
                value={`${devWallet.slice(0, 4)}...${devWallet.slice(-4)}`}
              />
            )}

            {boughtTokens != null && (
              <InfoBadgeTooltipRow
                label="Dev bought"
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
                label="Dev sold"
                value={formatCompactNumber(soldTokens)}
              />
            )}

            {devBalance != null && (
              <InfoBadgeTooltipRow
                label="Dev balance"
                value={formatCompactNumber(devBalance)}
              />
            )}

            {lastUpdateMs && (
              <InfoBadgeTooltipRow
                label="Last trade"
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
          ? "DS"
          : `${formatCompactNumber(devHoldPercent)}%`}
    </InfoBadge>
  );
};

export const DevMigratedAndLaunch = ({ token }: { token: TokenFull }) => {
  const isMigrated = token.screener?.is_graduated ?? false;
  const bondingPct = getTokenBondingPct(token);
  const statusLabel = isMigrated
    ? "Completed"
    : `${formatCompactNumber(bondingPct)}%`;

  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipGrid>
          <InfoBadgeTooltipRow
            label="Dev Migrated"
            value={isMigrated ? "Yes" : "No"}
          />
          <InfoBadgeTooltipRow
            label="Dev Launched"
            value={formatAge(token.created_time)}
          />
          <InfoBadgeTooltipRow
            label="Migrated"
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
