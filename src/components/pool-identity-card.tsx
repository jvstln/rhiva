import { PoolPairIcon } from "@/components/pool-table-cells";
import { LIQUIDITY_BINS, POOL_DETAIL } from "@/lib/mock/liquidity-detail-data";
import { cn } from "@/lib/utils";


export function PoolIdentityCard() {
  const { tokenA, tokenB, binStep, fee } = POOL_DETAIL;
  const maxHeight = Math.max(...LIQUIDITY_BINS.map((b) => b.height));

  return (
    <div className="space-y-4 border-b border-border/70 p-4">
      <div className="flex items-center gap-3">
        <PoolPairIcon />
        <div>
          <p className="text-b-1 font-bold text-white">{POOL_DETAIL.pair}</p>
          <p className="text-b-5 text-grey">
            Bin Step: {binStep} Fee: {fee}
          </p>
        </div>
      </div>

      <TokenBalanceRow
        symbol={tokenA.symbol}
        balance={tokenA.balance}
        meta={tokenA.meta}
      />
      <TokenBalanceRow
        symbol={tokenB.symbol}
        balance={tokenB.balance}
        meta={tokenB.meta}
      />

      <div>
        <div className="mb-2 flex items-center justify-between text-b-4">
          <span className="font-medium text-white">Liquidity Distribution</span>
        </div>
        <div className="mb-2 flex items-center gap-3 text-b-5 text-grey">
          <LegendDot className="bg-violet-500" label="USDC" />
          <LegendDot className="bg-primary" label="SOL" />
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
            <span className="rounded bg-card px-1.5 py-0.5 text-b-6 text-grey shadow ring-1 ring-border">
              Current price
              <br />
              0.0000223 SOL/USDC
            </span>
            <span className="mt-1 h-full w-px flex-1 bg-white/60" />
          </div>
        </div>
        <div className="mt-1 flex justify-between text-b-5 text-grey">
          <span>0,0198</span>
          <span>0,0447</span>
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
        <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-b-6 font-bold text-white">
          {symbol[0]}
        </span>
        <div>
          <p className="text-b-3 font-semibold text-white">{symbol}</p>
          <p className="text-b-5 text-grey">{meta}</p>
        </div>
      </div>
      <p className="text-b-3 font-medium text-white">{balance}</p>
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
