import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PumpFunIcon } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";
import type { MemeToken, TrendingToken } from "../../market.token.type";

interface TokenHoverTooltipProps {
  token: MemeToken | TrendingToken;
  size?: "default" | "sm";
}

export function TokenAvatar({
  token,
  size = "default",
}: TokenHoverTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="group relative flex items-center justify-start rounded-[3px] border border-primary p-0.5">
          <Avatar
            variant="square"
            className={cn(
              "group/image relative size-[36px] shrink-0 sm:size-[56px]",
              size === "sm" && "sm:size-[49px]",
            )}
          >
            <AvatarImage src={token.logo_uri ?? ""} />
            <AvatarFallback>{getInitials(token.name)}</AvatarFallback>
          </Avatar>

          <PumpFunIcon className="translate-1/2 absolute right-0 bottom-0 z-10 size-2 rounded-full border border-current p-px text-primary sm:size-3" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="px-2 py-2">
        <Avatar variant="square" className={"size-[236px]"}>
          <AvatarImage src={token.logo_uri ?? ""} />
          <AvatarFallback>{getInitials(token.name)}</AvatarFallback>
        </Avatar>
      </TooltipContent>
    </Tooltip>
  );
}
