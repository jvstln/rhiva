import { TokenSOL } from "@web3icons/react";
import type { TokenDetail } from "@rhivadotfun/dataapi";
import { BadgeDollarSign, Check, ChefHat, Copy, Crown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TokenInfoProps } from "./TokenInfo";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
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
            {devHoldPercent === undefined || devHoldPercent === null ? (
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
            {token.creator ? (
              <InfoBadgeTooltipRow
                label="Dev wallet"
                value={
                  <div className="flex items-center gap-0.5">
                    {`${token.creator.slice(0, 4)}...${token.creator.slice(-4)}`}
                    <TokenSOL className="size-3.5" />
                  </div>
                }
              />
            ) : (
              <InfoBadgeTooltipRow
                label="Dev wallet"
                value="N/A"
              />
            )}

            <InfoBadgeTooltipRow
              label="Bought"
              value="N/A"
            />

            <InfoBadgeTooltipRow
              label="Sold"
              value="N/A"
            />
            <InfoBadgeTooltipRow
              label="Balance"
              value={
                token.holders?.dev_balance !== undefined &&
                token.holders?.dev_balance !== null
                  ? formatCompactCurrency(
                      token.holders.dev_balance * token.price_usd,
                    )
                  : "N/A"
              }
            />
            {token.creator ? (
              <InfoBadgeTooltipRow
                label="Funding"
                value={`${token.creator.slice(0, 4)}...${token.creator.slice(-4)}`}
              />
            ) : (
              <InfoBadgeTooltipRow
                label="Funding"
                value="N/A"
              />
            )}
            <InfoBadgeTooltipRow
              label="Transfer In"
              value="N/A"
            />
            <InfoBadgeTooltipRow
              label="Time"
              value="N/A"
            />
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <ChefHat />
      {devHoldPercent === undefined || devHoldPercent === null
        ? "N/A"
        : hasDevSoldAll
          ? "DS"
          : `${formatCompactNumber(devHoldPercent)}%`}
    </InfoBadge>
  );
};

export const DevMigratedAndLaunch = ({ token }: { token: TokenDetail }) => {
  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipGrid>
          <InfoBadgeTooltipRow
            label="Dev Migrated"
            value="N/A"
          />
          <InfoBadgeTooltipRow
            label="Dev Launched"
            value="N/A"
          />
          <InfoBadgeTooltipRow
            label="Migrated"
            value="N/A"
          />
        </InfoBadgeTooltipGrid>
      }
    >
      <Crown />
      N/A
    </InfoBadge>
  );
};

export const CashbackNotice = ({ token }: { token: TokenDetail }) => {
  return null;
};
