import { LIQUIDITY_SUMMARY } from "@/lib/mock/liquidity-data";

export function PoolsHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 px-6 pt-8 pb-6">
      <div>
        <h1 className="text-h4 font-bold text-primary">Liquidity Pools</h1>
        <p className="mt-1 text-b-2 text-grey">
          Provide liquidity, earn yield.
        </p>
      </div>

      <div className="flex gap-10">
        <SummaryStat label="Total Value Locked" value={LIQUIDITY_SUMMARY.tvl} />
        <SummaryStat label="24H Volume" value={LIQUIDITY_SUMMARY.volume24h} />
        <SummaryStat label="24H Fees" value={LIQUIDITY_SUMMARY.fees24h} />
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-b-3 text-grey">{label}</p>
      <p className="mt-1 text-h6 font-bold text-white">{value}</p>
    </div>
  );
}
