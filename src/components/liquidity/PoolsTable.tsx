import { ArrowUpDown, Rocket, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { POOL_TABLE_COLUMNS, POOLS } from "@/data/liquidity-data";

import { PoolPairIcon, ValueChangeCell } from "./PoolTableCells";

export function PoolsTable() {
  return (
    <div className="overflow-x-auto px-6 pb-10">
      <table className="w-full min-w-[1200px] border-collapse text-left">
        <thead>
          <tr className="text-b-3 text-grey">
            <th className="w-10 py-3" />
            <th className="py-3 pr-6 font-medium">Pool</th>
            {POOL_TABLE_COLUMNS.map((col) => (
              <th key={col} className="py-3 pr-6 font-medium">
                <span className="inline-flex items-center gap-1">
                  {col}
                  <ArrowUpDown className="size-3" />
                </span>
              </th>
            ))}
            <th className="w-10 py-3" />
            <th className="w-24 py-3" />
          </tr>
        </thead>
        <tbody>
          {POOLS.map((pool, i) => (
            <tr key={i} className="border-t border-border/40">
              <td className="py-4 pr-2">
                <Star className="size-4 text-grey" />
              </td>
              <td className="py-4 pr-6">
                <div className="flex items-center gap-3">
                  <PoolPairIcon />
                  <div>
                    <p className="text-b-2 font-semibold text-white">
                      {pool.pair}
                    </p>
                    <p className="text-b-5 text-grey">
                      Tick Spacing: {pool.tickSpacing} Fee: {pool.fee}
                    </p>
                    <p className="text-b-5 text-grey">{pool.age}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell
                  value={pool.marketCap}
                  change={pool.marketCapChange}
                />
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell value={pool.tvl} change={pool.tvlChange} />
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell
                  value={pool.activeTvl}
                  change={pool.activeTvlChange}
                />
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell value={pool.fees} change={pool.feesChange} />
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell
                  value={pool.feesRatio}
                  change={pool.feesRatioChange}
                />
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell
                  value={pool.volume}
                  change={pool.volumeChange}
                />
              </td>
              <td className="py-4 pr-6">
                <ValueChangeCell
                  value={pool.volumeRatio}
                  change={pool.volumeRatioChange}
                />
              </td>
              <td className="py-4 pr-2">
                <Rocket className="size-4 text-primary" />
              </td>
              <td className="py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/70"
                >
                  More
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
