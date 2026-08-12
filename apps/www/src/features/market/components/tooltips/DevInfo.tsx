import { TokenSOL } from "@web3icons/react";
import type { TokenDetail } from "@rhivadotfun/dataapi";
import { ChefHat, Crown } from "lucide-react";

import { cn, formatAge } from "@/lib/utils";
import type { TokenInfoProps } from "./TokenInfo";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipHeader,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";

export const DevHoldOrDevSell = ({ token, ...props }: TokenInfoProps) => {
  const devHoldPercent = token.holders?.dev_holder_pct;
  const hasDevSoldAll = devHoldPercent === 0;
  const devWallet = token.creator || token.insiders?.creator_wallet;
  const funderWallet = token.insiders?.creator_funder;

  const devInsider = token.insiders?.insiders?.find(
    (i) =>
      i.wallet === devWallet ||
      i.relation.toLowerCase() === "creator" ||
      i.relation.toLowerCase() === "dev",
  );

  const boughtTokens = devInsider?.tokens_bought;
  const boughtSol = devInsider?.sol_spent;
  const devBalance = token.holders?.dev_balance;

  const soldTokens =
    boughtTokens != null && devBalance != null
      ? Math.max(0, boughtTokens - devBalance)
      : null;

  const lastUpdateMs =
    token.holders?.last_update_ms || token.recent_listing_time;

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        hasDevSoldAll
          ? "[--accent:var(--color-info)]"
          : "[--accent:var(--color-up)]",
      )}
      tooltip={
        <div>
          <InfoBadgeTooltipHeader>
            {devHoldPercent == null ? (
              "Dev Holds N/A"
            ) : hasDevSoldAll ? (
              "Dev Sell All"
            ) : (
              <>
                Dev Holds{" "}
                <span className="text-up">
                  {formatCompactNumber(devHoldPercent)}%
                </span>
              </>
            )}
          </InfoBadgeTooltipHeader>
          <InfoBadgeTooltipGrid>
            <InfoBadgeTooltipRow
              label="Dev wallet"
              value={
                devWallet ? (
                  <div className="flex items-center gap-0.5">
                    {`${devWallet.slice(0, 4)}...${devWallet.slice(-4)}`}
                    <TokenSOL className="size-3.5" />
                  </div>
                ) : (
                  "N/A"
                )
              }
            />

            <InfoBadgeTooltipRow
              label="Bought"
              value={
                boughtSol != null
                  ? `${formatCompactNumber(boughtSol)} SOL`
                  : boughtTokens != null
                    ? formatCompactNumber(boughtTokens)
                    : "N/A"
              }
            />

            <InfoBadgeTooltipRow
              label="Sold"
              value={
                soldTokens != null
                  ? formatCompactNumber(soldTokens)
                  : hasDevSoldAll && boughtTokens != null
                    ? formatCompactNumber(boughtTokens)
                    : "N/A"
              }
            />
            <InfoBadgeTooltipRow
              label="Balance"
              value={formatCompactCurrency(
                devBalance != null ? devBalance * token.price_usd : null,
              )}
            />
            <InfoBadgeTooltipRow
              label="Funding"
              value={
                funderWallet
                  ? `${funderWallet.slice(0, 4)}...${funderWallet.slice(-4)}`
                  : "N/A"
              }
            />
            <InfoBadgeTooltipRow
              label="Transfer In"
              value="N/A"
            />
            <InfoBadgeTooltipRow
              label="Time"
              value={formatAge(lastUpdateMs)}
            />
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <ChefHat />
      {devHoldPercent == null
        ? "N/A"
        : hasDevSoldAll
          ? "DS"
          : `${formatCompactNumber(devHoldPercent)}%`}
    </InfoBadge>
  );
};

export const DevMigratedAndLaunch = ({ token }: { token: TokenDetail }) => {
  const isMigrated = token.bonding?.stage === "completed";
  const statusLabel = isMigrated
    ? "Completed"
    : `${formatCompactNumber(token.bonding.completion_pct)}%`;

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
            value={formatAge(token.recent_listing_time)}
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

export const CashbackNotice = ({ token }: { token: TokenDetail }) => {
  return null;
};
