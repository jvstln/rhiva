"use client";

import type { LiquidityPool } from "../../liquidity.type";
import { formatPrice } from "../../liquidity.util";
import { BarGraph } from "../BarGraph";

const MOCK_BARS = Array.from({ length: 41 }, (_, i) => {
  const offset = i - 20;
  return {
    label: 0.015625 * Math.pow(1.001, offset),
    value: Math.exp(-(offset ** 2) / 120),
  };
});

export function LiquidityDepthChart({ pool }: { pool: LiquidityPool }) {
  const distribution = pool.liquidity_distribution;

  const data =
    distribution && distribution.length > 0
      ? distribution.map((bin) => ({
          label: bin.price,
          value: bin.base_amount + bin.quote_amount,
        }))
      : MOCK_BARS;

  const markerIndex =
    distribution && distribution.length > 0
      ? distribution.findIndex((bin) => bin.bin_id >= pool.active_id)
      : Math.floor(data.length / 2);

  return (
    <BarGraph
      data={data}
      markerIndex={markerIndex >= 0 ? markerIndex : undefined}
      showLabels
      formatLabel={(label) => formatPrice(label, 4)}
    />
  );
}
