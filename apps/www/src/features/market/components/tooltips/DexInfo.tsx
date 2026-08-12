import { Bot, HandCoins } from "lucide-react";
import type { TokenDetail } from "@rhivadotfun/dataapi";

import { EagleIcon } from "@/components/ui/icons";
import type { TokenInfoProps } from "./TokenInfo";
import { cn, formatCompactNumber } from "@/lib/utils";
import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";

export const DexPaid = ({ token, ...props }: TokenInfoProps) => {
  const isPaid = token.dex_paid ?? false;
  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        isPaid ? "[--accent:var(--color-up)]" : "[--accent:var(--color-down)]",
      )}
      tooltip={
        <InfoBadgeTooltipRow
          label="Dex Paid"
          value={isPaid ? "Paid" : "Unpaid"}
        />
      }
      {...props}
    >
      <EagleIcon />
      {isPaid ? "Paid" : "Unpaid"}
    </InfoBadge>
  );
};

export const BotActivity = ({ token, ...props }: TokenInfoProps) => {
  const activity = token.bot_activity;
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

export const TotalFees = ({ token }: { token: TokenDetail }) => {
  const feesPaid = token.global_fees_paid;
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
