import { Bot, HandCoins } from "lucide-react";
import type { TokenFull } from "@rhivadotfun/dataapi";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("metrics.dex");
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
            label={t("tooltip")}
            value={isPaid ? t("paid") : t("unpaid")}
          />
          {feesPaidUsd > 0 && (
            <InfoBadgeTooltipRow
              label={t("feesPaid")}
              value={formatCompactCurrency(feesPaidUsd)}
            />
          )}
          {token.screener?.is_graduated && (
            <InfoBadgeTooltipRow
              label={t("graduation")}
              value={t("graduated")}
            />
          )}
          {screener?.launchpad && (
            <InfoBadgeTooltipRow
              label={t("launchpad")}
              value={screener.launchpad}
            />
          )}
        </InfoBadgeTooltipGrid>
      }
      {...props}
    >
      <EagleIcon />
      {isPaid ? t("paid") : t("unpaid")}
    </InfoBadge>
  );
};

export const BotActivity = ({ token, ...props }: TokenInfoProps) => {
  const t = useTranslations("metrics.bot");
  const activity = token.intel?.score ?? 0;
  return (
    <InfoBadge
      variant={"badge"}
      tooltip={
        <InfoBadgeTooltipRow
          label={t("tooltip")}
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
  const t = useTranslations("metrics.totalFees");
  const feesPaid = token.intel?.fees?.total_sol ?? 0;
  return (
    <InfoBadge
      className="[--accent:var(--color-warn)]"
      tooltip={
        <InfoBadgeTooltipRow
          label={t("tooltip")}
          value={`${formatCompactNumber(feesPaid)} SOL`}
        />
      }
    >
      <HandCoins />
      {formatCompactNumber(feesPaid)}
    </InfoBadge>
  );
};
