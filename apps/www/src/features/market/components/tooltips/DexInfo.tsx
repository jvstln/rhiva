import { InfoBadge, InfoBadgeTooltipRow } from "@/components/ui/info-badge";
import type { Token } from "../../market.token.type";
import { cn, formatCompactNumber } from "@/lib/utils";
import { EagleIcon } from "@/components/ui/icons";
import { Bot } from "lucide-react";

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
