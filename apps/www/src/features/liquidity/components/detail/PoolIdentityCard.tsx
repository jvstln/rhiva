import type { TokenDetail } from "@rhivadotfun/dataapi";
import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { LiquidityAvatar } from "@/features/liquidity/components/tooltips/LiquidityAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCompactCurrency } from "@/lib/finance.util";
import { cn, getInitials } from "@/lib/utils";
import { BarGraph } from "../BarGraph";

export function PoolIdentityCard({ pool }: { pool: LiquidityPool }) {
  const baseSymbol =
    pool.token_a?.symbol ||
    pool.base_symbol ||
    pool.token_a?.mint.slice(0, 6) ||
    "---";
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
        meta={pool.token_a?.name ?? pool.token_a?.mint.slice(0, 6) ?? "---"}
      />
      <TokenBalanceRow
        token={pool.token_b}
        symbol={quoteSymbol}
        balance={formatCompactCurrency(quoteUsd)}
        meta={pool.token_b?.name ?? pool.token_b?.mint.slice(0, 6) ?? "---"}
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

        <BarGraph
          data={Array.from({ length: 100 }, () => ({ value: 1 }))}
          markerIndex={50}
        />
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
