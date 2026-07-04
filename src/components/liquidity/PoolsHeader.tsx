import { LIQUIDITY_SUMMARY } from "@/data/liquidity-data";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
} from "../layout/DashboardUi";

export function PoolsHeader() {
  return (
    <DashboardSlot>
      <div>
        <DashboardHeader>Liquidity Pools</DashboardHeader>
        <DashboardDescription>
          Provide liquidity, earn yield.
        </DashboardDescription>
      </div>

      <div className="flex gap-10">
        <SummaryStat label="Total Value Locked" value={LIQUIDITY_SUMMARY.tvl} />
        <SummaryStat label="24H Volume" value={LIQUIDITY_SUMMARY.volume24h} />
        <SummaryStat label="24H Fees" value={LIQUIDITY_SUMMARY.fees24h} />
      </div>
    </DashboardSlot>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-b-3 text-gray">{label}</p>
      <p className="mt-1 text-h6 font-bold text-white">{value}</p>
    </div>
  );
}
