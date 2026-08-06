import { useRouter } from "next/navigation";
import { NetworkSolana } from "@web3icons/react";
import { formatDistanceToNowStrict } from "date-fns";
import type { TokenDetail } from "@rhivadotfun/dataapi";

import { DexPaid } from "./tooltips/DexInfo";
import { Button } from "@/components/ui/button";
import { useMarketStore } from "../market.store";
import type { RadarColumns } from "../market.schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TokenAvatar,
  TokenDescription,
  TokenNameAndSymbol,
} from "./tooltips/TokenAvatar";
import {
  CashbackNotice,
  DevHoldOrDevSell,
  DevMigratedAndLaunch,
} from "./tooltips/DevInfo";
import {
  InfoBadge,
  InfoBadgeTooltipGrid,
  InfoBadgeTooltipRow,
} from "@/components/ui/info-badge";
import {
  TokenLatestPost,
  TokenConnection,
  TokenWebsite,
  TokenViewCount,
  TokenSocialSearch,
} from "./tooltips/Socials";
import {
  TopHolders,
  InsidersHold,
  BundlersHold,
  PhishingsHold,
  SnipersHold,
  TotalHolders,
  FreshHold,
} from "./tooltips/Holders";
import { toast } from "sonner";
import { useSwap } from "@/features/transaction/hooks/use-swap";

const TransactionInfo = ({ token }: { token: TokenDetail }) => {
  const window24h =
    token.timeframes?.windows?.["24h"] ??
    token.timeframes?.windows?.["1h"] ??
    Object.values(token.timeframes?.windows ?? {})[0];
  const volumeUsd = window24h?.volume_usd ?? 0;
  const buys = window24h?.buys !== undefined ? Number(window24h.buys) : 0;
  const sells = window24h?.sells ?? 0;
  const totalTransaction = buys + sells;

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <InfoBadge>
          V
          <span className="text-foreground">
            {formatCompactCurrency(volumeUsd)}
          </span>
        </InfoBadge>
        <InfoBadge>
          MC
          <span className="text-foreground">
            {formatCompactCurrency(token.market_cap_usd)}
          </span>
        </InfoBadge>
      </div>
      <div className="flex gap-2">
        <InfoBadge
          className="gap-0.5"
          tooltip={
            <InfoBadgeTooltipRow
              label="Prio & Tip & Trading Fees"
              value={
                token.global_fees_paid !== null
                  ? `${token.global_fees_paid} SOL`
                  : "N/A"
              }
            />
          }
        >
          F
          <NetworkSolana className="size-4" />
          <span className="[--accent:var(--color-foreground)]">
            {token.global_fees_paid !== null
              ? formatCompactNumber(token.global_fees_paid)
              : "N/A"}
          </span>
        </InfoBadge>

        <InfoBadge tooltip="Net buy">
          N
          <span className="[--accent:var(--color-up)]">
            {formatCompactCurrency(token.net_buy_usd)}
          </span>
        </InfoBadge>

        <InfoBadge
          tooltip={
            <InfoBadgeTooltipGrid>
              <InfoBadgeTooltipRow
                label={`TXs`}
                value={`${formatCompactNumber(totalTransaction)}`}
              />
              <InfoBadgeTooltipRow
                label={`Buys`}
                value={
                  <span className="text-up">{formatCompactNumber(buys)}</span>
                }
              />
              <InfoBadgeTooltipRow
                label={`Sells`}
                value={
                  <span className="text-down">
                    {formatCompactNumber(sells)}
                  </span>
                }
              />
            </InfoBadgeTooltipGrid>
          }
        >
          TX
          <span className="flex items-center gap-0.5 [--accent:var(--color-down)]">
            {formatCompactNumber(totalTransaction)}
            <div
              className="relative h-0.75 w-7 overflow-hidden rounded-full bg-down before:absolute before:inset-y-0 before:left-0 before:w-(--buy-percent) before:rounded-s-full before:bg-up before:transition"
              style={
                {
                  "--buy-percent": `${totalTransaction > 0 ? (buys / totalTransaction) * 100 : 0}%`,
                } as React.CSSProperties
              }
            />
          </span>
        </InfoBadge>
      </div>
    </div>
  );
};

const RADAR_METRICS: Array<
  (props: { token: TokenDetail }) => React.JSX.Element
> = [
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
  token: TokenDetail;
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
                  {token.social?.twitter_handle && (
                    <InfoBadge className="[--accent:var(--color-info)]">
                      @{token.social.twitter_handle}
                    </InfoBadge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-1">
                  <InfoBadge className="font-semibold text-sm [--accent:var(--color-up)]">
                    {token.live?.updated_at
                      ? formatDistanceToNowStrict(
                          new Date(Number(token.live.updated_at)),
                        ).replace(/^.*?(\d+)\s*(\w).*$/, "$1$2")
                      : "N/A"}
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
                <BuyAndSellActions
                  column={column}
                  token={token}
                />
              </div>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Bonding: {formatCompactNumber(token.bonding?.completion_pct)}%
      </TooltipContent>
    </Tooltip>
  );
}

const BuyAndSellActions = ({
  column,
  token,
}: {
  column: RadarColumns;
  token: TokenDetail;
}) => {
  const quickBuy = useMarketStore(
    (state) => state.radarFilters[column].quickBuy,
  );
  const quickSell = useMarketStore(
    (state) => state.radarFilters[column].quickSell,
  );
  const swap = useSwap();

  return (
    <div className="flex items-center justify-start gap-2">
      {quickSell !== null && (
        <Button
          variant="sell"
          size="sm"
          data-require-auth
          loading={swap.isPending && swap.variables.action === "sell"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (quickSell <= 0) {
              return toast.error("Quick sell amount must be greater than zero");
            }

            swap.mutate({
              action: "sell",
              inputMint: token.mint,
              inputDecimals: token.decimals,
              amount: quickSell,
            });
          }}
        >
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
        <Button
          size="sm"
          data-require-auth
          loading={swap.isPending && swap.variables.action === "buy"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (quickBuy <= 0) {
              return toast.error("Quick buy amount must be greater than zero");
            }

            swap.mutate({
              action: "buy",
              outputMint: token.mint,
              amount: quickBuy,
            });
          }}
        >
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
