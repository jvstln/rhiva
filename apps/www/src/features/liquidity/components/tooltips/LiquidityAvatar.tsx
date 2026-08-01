import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LiquidityInfoProps } from "./LiquidityInfo";
import { getInitials } from "@/lib/utils";
import { POOL_DEXES } from "../../liquidity.schema";
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
  const dex = POOL_DEXES[liquidity.dex];

  return (
    <div className="relative flex w-21 *:data-[slot=avatar]:border">
      <Avatar variant="circle" size={"lg"}>
        <AvatarImage src={liquidity.tokenA.mint} />
        <AvatarFallback>{getInitials(liquidity.tokenA.name)}</AvatarFallback>
      </Avatar>

      <Avatar
        variant="circle"
        size={"lg"}
        className={"relative top-0 -translate-x-2/3"}
      >
        <AvatarImage src={liquidity.tokenB.mint} />
        <AvatarFallback>{getInitials(liquidity.tokenB.name)}</AvatarFallback>
        {dex && <dex.icon className="absolute right-0 bottom-0" />}
      </Avatar>
    </div>
  );
};

export const LiquidityAddressCopy = ({ liquidity }: LiquidityInfoProps) => {
  const { copy } = useCopyToClipboard();

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

      <DropdownMenuContent align="center" className="w-fit max-w-62.5">
        <DropdownMenuItem onClick={() => copy(liquidity.address)}>
          <Copy />
          Copy pool address
          <span>
            {liquidity.address.slice(0, 6)}...{liquidity.address.slice(-6)}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copy(liquidity.tokenA.mint)}>
          <Copy />
          Copy
          <span className="truncate">{liquidity.tokenA.mint}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copy(liquidity.tokenB.mint)}>
          <Copy />
          Copy
          <span className="truncate">{liquidity.tokenB.mint}</span>
        </DropdownMenuItem>

        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${liquidity.tokenA.name}+token`}
          className="truncate"
        >
          <SimpleIcon icon={siX} className="text-foreground" />X search for{" "}
          <span className="truncate">{liquidity.tokenA.name}</span>
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem
          target="_blank"
          href={`https://x.com/search?q=${liquidity.tokenB.name}+token`}
          className="truncate"
        >
          <SimpleIcon icon={siX} className="text-foreground" />X search for{" "}
          <span className="truncate">{liquidity.tokenB.name}</span>
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
