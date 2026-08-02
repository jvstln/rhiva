import type { TokenDetail } from "@rhivadotfun/dataapi";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { LiquidityAvatar } from "@/features/liquidity/components/tooltips/LiquidityAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCompactCurrency } from "@/lib/finance.util";
import { cn, getInitials } from "@/lib/utils";
import {
  formatPrice,
  getActiveBinIndex,
  getLiquidityBars,
  getPoolPriceInQuote,
} from "@/features/liquidity/liquidity.util";

const shortId = (v?: string) => (v ? v.slice(0, 6) : "----");

export function PoolIdentityCard({ pool }: { pool: LiquidityPool }) {
  const bars = getLiquidityBars(pool, 48);
  const activeIndex = getActiveBinIndex(bars, pool.active_id);
  const activeBinId = bars[activeIndex]?.bin_id ?? 0;
  const priceInQuote = getPoolPriceInQuote(pool);

  const baseSymbol =
    pool.token_a?.symbol || pool.base_symbol || shortId(pool.token_a?.mint);
  const quoteSymbol = pool.token_b?.symbol || "SOL";
  const pair = `${baseSymbol}/${quoteSymbol}`;

  const totalFeePct = Number(pool.total_fee_pct ?? 0);
  const feeLabel =
    totalFeePct > 0 ? `${totalFeePct}%` : `${pool.bin_step ?? 0}bps`;

  const baseUsd = pool.tvl_distribution?.base_usd ?? 0;
  const quoteUsd = pool.tvl_distribution?.quote_usd ?? 0;

  return (
    <div className="space-y-4 border-border/70 border-b p-4">
      <div className="flex items-center gap-3">
        <LiquidityAvatar liquidity={pool} />
        <div>
          <p className="font-bold text-b-1 text-white">{pair}</p>
          <p className="text-b-5 text-gray">
            Bin Step: {pool.bin_step ?? "—"} Fee: {feeLabel}
          </p>
        </div>
      </div>

      <TokenBalanceRow
        token={pool.token_a}
        symbol={baseSymbol}
        balance={formatCompactCurrency(baseUsd)}
        meta={pool.token_a?.name ?? shortId(pool.token_a?.mint)}
      />
      <TokenBalanceRow
        token={pool.token_b}
        symbol={quoteSymbol}
        balance={formatCompactCurrency(quoteUsd)}
        meta={pool.token_b?.name ?? shortId(pool.token_b?.mint)}
      />

      <div>
        <div className="mb-2 flex items-center justify-between text-b-4">
          <span className="font-medium text-white">Liquidity Distribution</span>
        </div>
        <div className="mb-2 flex items-center gap-3 text-b-5 text-gray">
          <LegendDot
            className="bg-violet-500"
            label={baseSymbol}
          />
          <LegendDot
            className="bg-primary"
            label={quoteSymbol}
          />
        </div>

        <div className="relative flex h-24 items-end gap-[2px]">
          {bars.length > 0 ? (
            bars.map((bar) => (
              <span
                key={bar.bin_id}
                className={cn(
                  "flex-1 rounded-t-sm",
                  bar.bin_id <= activeBinId ? "bg-violet-500" : "bg-primary",
                )}
                style={{ height: `${Math.max(2, bar.height * 100)}%` }}
              />
            ))
          ) : (
            // TODO: Liquidity distribution isn't available for this pool.
            <span className="flex h-full w-full items-center justify-center text-b-6 text-gray">
              No liquidity data
            </span>
          )}
          <div
            className="pointer-events-none absolute inset-y-0 flex flex-col items-center"
            style={{
              left: `${
                bars.length > 1 ? (activeIndex / (bars.length - 1)) * 100 : 50
              }%`,
            }}
          >
            <span className="rounded bg-card px-1.5 py-0.5 text-b-6 text-gray shadow ring-1 ring-border">
              Current price
              <br />
              {formatPrice(priceInQuote)} {quoteSymbol}/{baseSymbol}
            </span>
            <span className="mt-1 h-full w-px flex-1 bg-white/60" />
          </div>
        </div>
        <div className="mt-1 flex justify-between text-b-5 text-gray">
          <span>{pool.tvl_distribution?.base_pct?.toFixed(2) ?? "—"}%</span>
          <span>{pool.tvl_distribution?.quote_pct?.toFixed(2) ?? "—"}%</span>
        </div>
      </div>
    </div>
  );
}

function TokenBalanceRow({
  token,
  symbol,
  balance,
  meta,
}: {
  token?: TokenDetail;
  symbol: string;
  balance: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarImage src={token?.logo_uri ?? undefined} />
          <AvatarFallback>{getInitials(symbol)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-b-3 text-white">{symbol}</p>
          <p className="text-b-5 text-gray">{meta}</p>
        </div>
      </div>
      <p className="font-medium text-b-3 text-white">{balance}</p>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("size-2 rounded-full", className)} />
      {label}
    </span>
  );
}
