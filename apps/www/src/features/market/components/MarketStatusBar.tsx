import React from "react";
import {
  NetworkBitcoin,
  NetworkEthereum,
  NetworkSolana,
} from "@web3icons/react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { InfoBadge } from "@/components/ui/info-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DUMMY_TOKENS = [
  {
    id: "sol",
    symbol: "SOL",
    price: "$29.44",
    change: "-1.33%",
    isPositive: false,
    Icon: NetworkSolana,
  },
  {
    id: "btc",
    symbol: "BTC",
    price: "$64,230.00",
    change: "+2.45%",
    isPositive: true,
    Icon: NetworkBitcoin,
  },
  {
    id: "eth",
    symbol: "ETH",
    price: "$3,420.50",
    change: "+1.12%",
    isPositive: true,
    Icon: NetworkEthereum,
  },
];

export const MarketStatusBar = (props: React.ComponentProps<"div">) => {
  return (
    <ScrollArea className="border-b">
      <div
        {...props}
        className={cn(
          "flex h-8 shrink-0 items-center *:h-full *:shrink-0 *:data-[slot=separator]:h-4/5 *:data-[slot=separator]:self-center",
          props.className,
        )}
      >
        {DUMMY_TOKENS.map((token, index) => (
          <React.Fragment key={token.id}>
            <InfoBadge className="px-2 transition hover:bg-foreground/10">
              <token.Icon />
              <span className="[--accent:var(--color-foreground)]">
                {token.symbol}
              </span>
              <span className="">{token.price}</span>
              <span
                className={
                  token.isPositive
                    ? "[--accent:var(--color-up)]"
                    : "[--accent:var(--color-down)]"
                }
              >
                {token.change}
              </span>
            </InfoBadge>
            {index === 0 && <Separator orientation="vertical" />}
          </React.Fragment>
        ))}
      </div>
      <ScrollBar
        orientation="horizontal"
        showIndicator
        showScrollBar={false}
      />
    </ScrollArea>
  );
};
