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

export const BotSummary = ({ token }: DexProps) => {
  return (
    <InfoBadge
      variant={"badge"}
      tooltip={
        <InfoBadgeTooltipRow label="141 wallets that used Axiom, Padre, Photon etc., and current holding 31.47%" />
      }
    >
      <Bot />
      {`${formatCompactNumber(141)} / '31.47%`}
    </InfoBadge>
  );
};

export const GlobalFees = ({ token }: { token: Token }) => {
  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip="Prio & Tip & Trading Fees 23.10 SOL"
    >
      <HandCoins />
      {(token.global_fees_paid ?? 0).toFixed(2)}
    </InfoBadge>
  );
};
