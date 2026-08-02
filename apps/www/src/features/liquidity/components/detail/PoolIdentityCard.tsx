import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { LIQUIDITY_BINS } from "@/components/ui/data/liquidity-detail-data";
import { formatCompactCurrency } from "@/lib/finance.util";
import { cn } from "@/lib/utils";

const shortId = (v?: string) => (v ? v.slice(0, 6) : "----");

export function PoolIdentityCard({ pool }: { pool: LiquidityPool }) {
  const maxHeight = Math.max(...LIQUIDITY_BINS.map((b) => b.height));
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
        <div className="relative flex size-9 shrink-0 items-center">
          <span className="z-10 flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 font-bold text-b-6 text-white ring-2 ring-card">
            {baseSymbol[0]}
          </span>
          <span className="-ml-2.5 flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 font-bold text-b-6 text-white ring-2 ring-card">
            {quoteSymbol[0]}
          </span>
        </div>
        <div>
          <p className="font-bold text-b-1 text-white">{pair}</p>
          <p className="text-b-5 text-gray">
            Bin Step: {pool.bin_step ?? "—"} Fee: {feeLabel}
          </p>
        </div>
      </div>

      <TokenBalanceRow
        symbol={baseSymbol}
        balance={formatCompactCurrency(baseUsd)}
        meta={shortId(pool.token_a?.mint)}
      />
      <TokenBalanceRow
        symbol={quoteSymbol}
        balance={formatCompactCurrency(quoteUsd)}
        meta={shortId(pool.token_b?.mint)}
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
          {LIQUIDITY_BINS.map((bin) => (
            <span
              key={bin.bin}
              className={cn(
                "flex-1 rounded-t-sm",
                bin.isSol ? "bg-primary" : "bg-violet-500",
              )}
              style={{ height: `${(bin.height / maxHeight) * 100}%` }}
            />
          ))}
          <div className="pointer-events-none absolute inset-y-0 left-[46%] flex flex-col items-center">
            <span className="rounded bg-card px-1.5 py-0.5 text-b-6 text-gray shadow ring-1 ring-border">
              Current price
              <br />
              {pool.price_usd ? pool.price_usd.toExponential(4) : "N/A"}{" "}
              {baseSymbol}/{quoteSymbol}
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
  symbol,
  balance,
  meta,
}: {
  symbol: string;
  balance: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 font-bold text-b-6 text-white">
          {symbol[0]}
        </span>
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
