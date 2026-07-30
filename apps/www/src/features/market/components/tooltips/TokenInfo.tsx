import type { IconType } from "@/components/ui/icons";
import { InfoBadge } from "@/components/ui/info-badge";
import type { Token } from "../../market.token.type";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

export type TokenInfoProps = InfoBadge.Props & {
  token: Token;
  children?: (props: {
    value: string | number;
    icon?: IconType;
  }) => React.ReactNode;
};

export type TokenInfoComponent = (props: TokenInfoProps) => React.ReactNode;

export function AddressCopy({ address }: { address: string }) {
  const { copy, copyState } = useCopyToClipboard();

  if (!address)
    return (
      <InfoBadge className="cursor-not-allowed">Address not found</InfoBadge>
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
      {address.slice(0, 4)}...{address.slice(-4)}{" "}
      {copyState === "copied" ? <Check /> : <Copy />}
    </InfoBadge>
  );
}
