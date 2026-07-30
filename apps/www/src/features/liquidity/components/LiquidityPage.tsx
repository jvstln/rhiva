import { Suspense } from "react";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
} from "@/components/layout/DashboardUi";
import { Separator } from "@/components/ui/separator";
import { LIQUIDITY_SUMMARY } from "@/components/ui/data/liquidity-data";
import { PoolsTable } from "@/features/liquidity/components/PoolsTable";
import { PoolsToolbar } from "./PoolsToolbar";

const LiquidityPage = () => {
  return (
    <DashboardSlot>
      <div className="flex items-center justify-between gap-4">
        <div>
          <DashboardHeader>Liquidity Pools</DashboardHeader>
          <DashboardDescription>
            Provide liquidity, earn yield.
          </DashboardDescription>
        </div>
        <div className="flex gap-5">
          <SummaryStat
            label="Total Value Locked"
            value={LIQUIDITY_SUMMARY.tvl}
          />
          <Separator orientation="vertical" />
          <SummaryStat
            label="24H Volume"
            value={LIQUIDITY_SUMMARY.volume24h}
          />
          <Separator orientation="vertical" />
          <SummaryStat
            label="24H Fees"
            value={LIQUIDITY_SUMMARY.fees24h}
          />
        </div>
      </div>

      <PoolsToolbar />
      <PoolsTable />
    </DashboardSlot>
  );
};

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-b-3 text-gray">{label}</p>
      <p className="mt-1 font-bold text-h6 text-white">{value}</p>
    </div>
  );
}

const LiquidityPageWithSuspense = () => {
  return (
    <Suspense>
      <LiquidityPage />
    </Suspense>
  );
};

export { LiquidityPageWithSuspense as LiquidityPage };
