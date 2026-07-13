import { Suspense } from "react";
import { LiquidityDetailPage } from "@/features/liquidity/components/LiquidityDetailPage";

export default function LiquidityDetailRoute() {
  return (
    <Suspense>
      <LiquidityDetailPage />
    </Suspense>
  );
}
