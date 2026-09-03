import { Bot, HandCoins } from "lucide-react";
import type { TokenFull } from "@rhivadotfun/dataapi";

import { EagleIcon } from "@/components/ui/icons";
import type { TokenInfoProps } from "./TokenInfo";
import { cn, formatCompactNumber } from "@/lib/utils";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import { formatCompactCurrency } from "@/lib/finance.util";

export const DexPaid = ({ token, ...props }: TokenInfoProps) => {
  const screener = token.screener as {
    fees_usd?: number;
    fee_usd?: number;
    has_social_update?: number | boolean;
    socials?: { any?: boolean };
    launchpad?: string | null;
  } | null;
  const feesPaidUsd =
    screener?.fees_usd ??
    screener?.fee_usd ??
    token.intel?.fees?.total_paid_usd ??
    0;
  const hasSocials = Boolean(
    screener?.has_social_update || screener?.socials?.any,
  );
  const isPaid =
    hasSocials || feesPaidUsd > 0 || Boolean(token.screener?.is_graduated);

  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        isPaid ? "[--accent:var(--color-up)]" : "[--accent:var(--color-down)]",
      )}
      tooltip={
        <InfoBadgeTooltipGrid>
          <InfoBadgeTooltipRow
            label="Dex Paid"
            value={isPaid ? "Paid" : "Unpaid"}
          />
          {feesPaidUsd > 0 && (
            <InfoBadgeTooltipRow
              label="Dex Fees Paid"
              value={formatCompactCurrency(feesPaidUsd)}
            />
          )}
          {token.screener?.is_graduated && (
            <InfoBadgeTooltipRow
              label="Graduation"
              value="Graduated"
            />
          )}
          {screener?.launchpad && (
            <InfoBadgeTooltipRow
              label="Launchpad"
              value={screener.launchpad}
            />
          )}
        </InfoBadgeTooltipGrid>
      }
      {...props}
    >
      <EagleIcon />
      {isPaid ? "Paid" : "Unpaid"}
    </InfoBadge>
  );
};

export const BotActivity = ({ token, ...props }: TokenInfoProps) => {
  const activity = token.intel?.score ?? 0;
  return (
    <InfoBadge
      variant={"badge"}
      tooltip={
        <InfoBadgeTooltipRow
          label="Bot activity"
          value={formatCompactNumber(activity)}
        />
      }
      {...props}
    >
      <Bot />
      {formatCompactNumber(activity)}
    </InfoBadge>
  );
};

export const TotalFees = ({ token }: { token: TokenFull }) => {
  const feesPaid = token.intel?.fees?.total_sol ?? 0;
  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipRow
          label="Prio & Tip & Trading Fees"
          value={`${formatCompactNumber(feesPaid)} SOL`}
        />
      }
    >
      <HandCoins />
      {formatCompactNumber(feesPaid)}
    </InfoBadge>
  );
};
