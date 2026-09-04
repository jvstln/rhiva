import { Check, Copy } from "lucide-react";
import type { TokenFull } from "@rhivadotfun/dataapi";
import { useTranslations } from "next-intl";

import type { IconType } from "@/components/ui/icons";
import { InfoBadge } from "@/components/ui/info-badge";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

export type TokenInfoProps = InfoBadge.Props & {
  token: TokenFull;
  children?: (props: {
    value: string | number;
    icon?: IconType;
  }) => React.ReactNode;
};

export type TokenInfoComponent = (props: TokenInfoProps) => React.ReactNode;

export function AddressCopy({ address }: { address: string }) {
  const t = useTranslations("metrics.address");
  const { copy, copyState } = useCopyToClipboard();

  if (!address)
    return (
      <InfoBadge className="cursor-not-allowed">{t("notFound")}</InfoBadge>
    );

  return (
    <InfoBadge
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        copy(address);
      }}
      className="cursor-pointer text-sm"
    >
      {address.slice(0, 4)}...{address.slice(-4)}&nbsp;
      {copyState === "copied" ? <Check /> : <Copy />}
    </InfoBadge>
  );
}
