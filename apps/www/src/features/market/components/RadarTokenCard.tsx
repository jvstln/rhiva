import { Button } from "@/components/ui/button";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Token } from "@/features/market/market.type";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import type { RadarColumns } from "../market.schema";
import { useMarketStore } from "../market.store";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
} from "./tooltips/TokenAvatar";
import { useRouter } from "next/navigation";
import {
  CashbackNotice,
  DevHoldOrDevSell,
  DevMigratedAndLaunch,
} from "./tooltips/DevInfo";
import { DexPaid } from "./tooltips/DexInfo";
import {
  TopHolders,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  SnipersHold,
  TotalHolders,
  FreshHold,
} from "./tooltips/Holders";
import { formatDistanceToNowStrict } from "date-fns";
import {
  TokenLatestPost,
  TokenConnection,
  TokenWebsite,
  TokenViewCount,
  TokenSocialSearch,
} from "./tooltips/Socials";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NetworkSolana } from "@web3icons/react";

const TransactionInfo = ({ token }: { token: Token }) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <InfoBadge>
          V
          <span className="text-foreground">
            {formatCompactCurrency(token.volumeUsd)}
          </span>
        </InfoBadge>
        <InfoBadge>
          MC
          <span className="text-foreground">
            {formatCompactCurrency(token.marketCapUsd)}
          </span>
        </InfoBadge>
      </div>
      <div className="flex gap-2">
        <InfoBadge
          className="gap-0.5"
          tooltip={
            <InfoBadgeTooltipRow
              label="Prio & Tip & Trading Fees"
              value={`${token.fees.totalFeeSol} SOL`}
            />
          }
        >
          F
          <NetworkSolana className="size-4" />
          <span className="[--accent:var(--color-foreground)]">
            {formatCompactNumber(token.fees.totalFeeSol)}
          </span>
        </InfoBadge>

        <InfoBadge tooltip="Net buy">
          N
          <span className="[--accent:var(--color-up)]">
            {formatCompactNumber(token.netBuyUsd)}
          </span>
        </InfoBadge>

        <InfoBadge
          tooltip={
            <InfoBadgeTooltipGrid>
              <InfoBadgeTooltipRow
                label={`TXs`}
                value={`${formatCompactNumber(token.totalTransaction)}`}
              />
              <InfoBadgeTooltipRow
                label={`Buys`}
                value={
                  <span className="text-up">
                    {formatCompactNumber(token.buys)}
                  </span>
                }
              />
              <InfoBadgeTooltipRow
                label={`Sells`}
                value={
                  <span className="text-down">
                    {formatCompactNumber(token.sells)}
                  </span>
                }
              />
            </InfoBadgeTooltipGrid>
          }
        >
          TX
          <span className="flex items-center gap-0.5 [--accent:var(--color-down)]">
            {formatCompactNumber(token.totalTransaction)}
            <div
              className="relative h-0.75 w-7 overflow-hidden rounded-full bg-down before:absolute before:inset-y-0 before:left-0 before:w-(--buy-percent) before:rounded-s-full before:bg-up before:transition"
              style={
                {
                  "--buy-percent": `${(token.buys / token.totalTransaction) * 100}%`,
                } as React.CSSProperties
              }
            />
          </span>
        </InfoBadge>
      </div>
    </div>
  );
};

const RADAR_METRICS: Array<(props: { token: Token }) => React.JSX.Element> = [
  TopHolders,
  DevHoldOrDevSell,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  FreshHold,
  SnipersHold,
  DexPaid,
];

interface TokenCardProps {
  token: Token;
  column: RadarColumns;
}
export function RadarTokenCard({ token, column }: TokenCardProps) {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger
        render={<article />}
        className="group/token-display cursor-pointer border-border/70 border-b px-4 py-4 last:border-none hover:bg-white/5"
        onKeyDown={() => null}
        onClick={() => {
          router.push(`/token/${token.mint}`);
        }}
      >
        <div className="flex w-full min-w-0 items-center gap-3">
          {/* LEFT COLUMN: Avatar and Address */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <TokenAvatar token={token} />
            <span className="text-[10px] text-gray">
              {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
            </span>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Token Name + Token Info Row */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <TokenNameAndSymbol token={token} />
                <div className="flex items-center gap-1">
                  {token.socials.twitterHandle && (
                    <InfoBadge className="[--accent:var(--color-info)]">
                      @{token.socials.twitterHandle}
                    </InfoBadge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-1">
                  <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
                    {formatDistanceToNowStrict(token.updatedAt).replace(
                      /^.*?(\d+)\s*(\w).*$/,
                      "$1$2",
                    )}
                  </InfoBadge>
                  <CashbackNotice token={token} />
                  <TokenDescription token={token} />
                  <TokenSocialSearch token={token} />
                  <TokenLatestPost token={token} />
                  <TokenConnection token={token} />
                  <TokenWebsite token={token} />
                  <DevMigratedAndLaunch token={token} />
                  <TotalHolders token={token} />
                  <TokenViewCount token={token} />
                </div>
              </div>

              <TransactionInfo token={token} />
            </div>

            <div className="flex w-full min-w-0 items-end justify-between gap-1">
              <ScrollArea className="min-w-0 flex-1">
                <div className="flex gap-x-1">
                  {RADAR_METRICS.map((Metric, index) => {
                    return (
                      <Metric
                        // biome-ignore lint/suspicious/noArrayIndexKey: Order of metrics won't change
                        key={index}
                        token={token}
                      />
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="flex shrink-0 gap-1.5">
                <BuyAndSellActions column={column} />
              </div>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Bonding: {token.bonding.bondingPct}%</TooltipContent>
    </Tooltip>
  );
}

const BuyAndSellActions = ({ column }: { column: RadarColumns }) => {
  const quickBuy = useMarketStore(
    (state) => state.radarFilters[column].quickBuy,
  );
  const quickSell = useMarketStore(
    (state) => state.radarFilters[column].quickSell,
  );

  return (
    <div className="flex items-center justify-start gap-2">
      {quickSell !== null && (
        <Button variant="sell" size="sm">
          <span className={cn(quickSell > 0 && "group-hover/button:hidden")}>
            Sell
          </span>
          {quickSell > 0 && (
            <span className="hidden group-hover/button:inline">
              {quickSell}%
            </span>
          )}
        </Button>
      )}
      {quickBuy !== null && (
        <Button size="sm">
          <span className={cn(quickBuy > 0 && "group-hover/button:hidden")}>
            Buy
          </span>
          {quickBuy > 0 && (
            <span className="hidden group-hover/button:inline">
              {quickBuy} SOL
            </span>
          )}
        </Button>
      )}
    </div>
  );
};
