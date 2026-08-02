import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LiquidityInfoProps } from "./LiquidityInfo";
import { getInitials } from "@/lib/utils";
import { POOL_DEXES, type PoolDex } from "../../liquidity.schema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
} from "@/components/ui/dropdown-menu";
import { SimpleIcon } from "@/components/ui/icons";
import { Copy } from "lucide-react";
import { siX } from "simple-icons";
import { useCopyToClipboard } from "@/hooks";

export const LiquidityAvatar = ({ liquidity }: LiquidityInfoProps) => {
  const dex = POOL_DEXES[liquidity.dex as PoolDex];
  const { token_a, token_b } = liquidity;

  return (
    <div className="relative flex w-21 *:data-[slot=avatar]:border">
      <Avatar
        variant="circle"
        size={"lg"}
      >
        <AvatarImage src={token_a?.logo_uri ?? undefined} />
        <AvatarFallback>{getInitials(token_a?.name ?? null)}</AvatarFallback>
      </Avatar>

      <Avatar
        variant="circle"
        size={"lg"}
        className={"relative top-0 -translate-x-2/3"}
      >
        <AvatarImage src={token_b?.logo_uri ?? undefined} />
        <AvatarFallback>{getInitials(token_b?.name ?? null)}</AvatarFallback>
        {dex && <dex.icon className="absolute right-0 bottom-0" />}
      </Avatar>
    </div>
  );
};

export const LiquidityAddressCopy = ({ liquidity }: LiquidityInfoProps) => {
  const { copy } = useCopyToClipboard();
  const { token_a, token_b } = liquidity;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        openOnHover
        delay={0}
      >
        <Copy className="size-3 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-fit max-w-62.5"
      >
        <DropdownMenuItem onClick={() => copy(liquidity.pool_address)}>
          <Copy />
          Copy pool address
          <span>
            {liquidity.pool_address.slice(0, 6)}...
            {liquidity.pool_address.slice(-6)}
          </span>
        </DropdownMenuItem>
        {token_a && (
          <DropdownMenuItem onClick={() => copy(token_a.mint)}>
            <Copy />
            Copy
            <span className="truncate">{token_a.mint}</span>
          </DropdownMenuItem>
        )}
        {token_b && (
          <DropdownMenuItem onClick={() => copy(token_b.mint)}>
            <Copy />
            Copy
            <span className="truncate">{token_b.mint}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token_a?.name ?? ""}+token`}
          className="truncate"
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
          X search for{" "}
          <span className="truncate">{token_a?.name ?? "Unknown"}</span>
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${token_b?.name ?? ""}+token`}
          className="truncate"
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
          X search for{" "}
          <span className="truncate">{token_b?.name ?? "Unknown"}</span>
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
