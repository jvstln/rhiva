import LiquidityPoolPage from "@/features/liquidity/components/LiquidityPoolPage";
import type { Pool } from "@/features/liquidity/liquidity.schema";

export default async function LiquidityPoolRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const dex = params.dex as Pool | undefined;
  return <LiquidityPoolPage dex={dex || "meteora"} />;
}
