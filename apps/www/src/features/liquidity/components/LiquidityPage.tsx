"use client";

import { Suspense, useMemo } from "react";

import { PoolsToolbar } from "./LiquidityToolbar";
import { Separator } from "@/components/ui/separator";
import { useLiquidityPools } from "../liquidity.hook";
import { useLiquidityWebsocket } from "../liquidity.ws";
import { formatCompactCurrency } from "@/lib/finance.util";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
} from "@/components/layout/DashboardUi";
import { PoolsTable } from "./LiquidityPoolsTable";

const LiquidityPage = () => {
  useLiquidityWebsocket();
  const { data: pools } = useLiquidityPools();

  const stats = useMemo(() => {
    if (!pools) {
      return {
        tvl: "N/A",
        volume24h: "N/A",
        fees24h: "N/A",
      };
    }

    let totalTvl = 0;
    let totalVolume24h = 0;
    let totalFees24h = 0;

    for (const pool of pools) {
      totalTvl += pool.tvl_usd ?? 0;
      totalVolume24h += pool.volume_24h_usd ?? 0;

      const totalFeePct = Number(
        pool.total_fee_pct ?? pool.base_fee_pct ?? pool.dynamic_fee_pct ?? 0,
      );
      totalFees24h += (pool.volume_24h_usd ?? 0) * (totalFeePct / 100);
    }

    return {
      tvl: formatCompactCurrency(totalTvl),
      volume24h: formatCompactCurrency(totalVolume24h),
      fees24h: formatCompactCurrency(totalFees24h),
    };
  }, [pools]);

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
            value={stats.tvl}
          />
          <Separator orientation="vertical" />
          <SummaryStat
            label="24H Volume"
            value={stats.volume24h}
          />
          <Separator orientation="vertical" />
          <SummaryStat
            label="24H Fees"
            value={stats.fees24h}
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
