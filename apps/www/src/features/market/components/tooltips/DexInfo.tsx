import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import type { Token } from "../../market.token.type";
import { cn, formatCompactNumber } from "@/lib/utils";
import { EagleIcon } from "@/components/ui/icons";
import { Bot, HandCoins } from "lucide-react";

type DexProps = { token: Token };
export const DexPaid = ({ token }: DexProps) => {
  return (
    <InfoBadge
      variant={"badge"}
      className={cn(
        token.dexPaid > 0
          ? "[--accent:var(--color-up)]"
          : "[--accent:var(--color-down)]",
      )}
      tooltip={<InfoBadgeTooltipRow label="Dex Paid" />}
    >
      <EagleIcon />
      {token.dexPaid > 0
        ? `${formatCompactNumber(token.dexPaid)}% CTO`
        : "Unpaid"}
    </InfoBadge>
  );
};

export const BotActivity = ({ token }: DexProps) => {
  return (
    <InfoBadge
      variant={"badge"}
      tooltip={<InfoBadgeTooltipRow label="Bot activity" />}
    >
      <Bot />
      {`${formatCompactNumber(token.bot_activity)}`}
    </InfoBadge>
  );
};

export const TotalFees = ({ token }: { token: Token }) => {
  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipRow
          label="Prio & Tip & Trading Fees"
          value={`${token.global_fees_paid ?? 0} SOL`}
        />
      }
    >
      <HandCoins />
      {formatCompactNumber(token.global_fees_paid ?? 0)}
    </InfoBadge>
  );
};
