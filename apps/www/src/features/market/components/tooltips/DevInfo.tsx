import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipHeader,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import type { Token } from "../../market.token.type";
import { TokenSOL } from "@web3icons/react";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { BadgeDollarSign, Check, ChefHat, Copy, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenInfoProps } from "./TokenInfo";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

export const DevHoldOrDevSell = ({ token, ...props }: TokenInfoProps) => {
  const devHoldPercent = token.dev.tokenBalance / token.totalSupply || 0;
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
            {hasDevSoldAll ? (
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
            {token.dev.address && (
              <InfoBadgeTooltipRow
                label="Dev wallet"
                value={
                  <div className="flex items-center gap-0.5">
                    {`${token.dev.address.slice(0, 4)}...${token.dev.address.slice(-4)}`}
                    <TokenSOL className="size-3.5" />
                  </div>
                }
              />
            )}

            <InfoBadgeTooltipRow
              label="Bought"
              value={
                <div className="flex items-center gap-1">
                  <span className="text-up">{`${formatCompactCurrency(token.dev.buys)}`}</span>
                  /
                  <span className="text-up">{`${formatCompactCurrency(token.dev.buyTransactions)}`}</span>
                </div>
              }
            />

            <InfoBadgeTooltipRow
              label="Sold"
              value={
                <div className="flex items-center gap-1">
                  <span className="text-down">{`${formatCompactCurrency(token.dev.sells)}`}</span>
                  /
                  <span className="text-down">{`${formatCompactCurrency(token.dev.sellTransactions)}`}</span>
                </div>
              }
            />
            <InfoBadgeTooltipRow
              label="Balance"
              value={formatCompactCurrency(
                token.dev.tokenBalance * token.priceUsd,
              )}
            />
            {token.dev.fundedByAddress && (
              <InfoBadgeTooltipRow
                label="Funding"
                value={`${token.dev.fundedByAddress.slice(0, 4)}...${token.dev.fundedByAddress.slice(-4)}`}
              />
            )}
            <InfoBadgeTooltipRow
              label="Transfer In"
              value={`${formatCompactCurrency(0.1)} SOL`}
            />
            <InfoBadgeTooltipRow
              label="Time"
              value={new Date().toISOString()}
            />
          </InfoBadgeTooltipGrid>
        </div>
      }
      {...props}
    >
      <ChefHat />
      {hasDevSoldAll ? "DS" : `${formatCompactNumber(devHoldPercent)}%`}
    </InfoBadge>
  );
};

export const DevMigratedAndLaunch = ({ token }: { token: Token }) => {
  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipGrid>
          <InfoBadgeTooltipRow
            label="Dev Migrated"
            value={token.dev.migrated}
          />
          <InfoBadgeTooltipRow
            label="Dev Launched"
            value={token.dev.launched}
          />
          <InfoBadgeTooltipRow
            label="Migrated"
            value={`${formatCompactNumber(token.dev.migrated / token.dev.launched || 0)}%`}
          />
        </InfoBadgeTooltipGrid>
      }
    >
      <Crown />
      {token.dev.migrated}/{token.dev.launched}
    </InfoBadge>
  );
};

export const CashbackNotice = ({ token }: { token: Token }) => {
  if (token.fees.totalCashbackSol <= 0) return null;

  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        "Cashback coins return the creator fee to traders instead of the coin creator"
      }
    >
      <BadgeDollarSign />
    </InfoBadge>
  );
};
