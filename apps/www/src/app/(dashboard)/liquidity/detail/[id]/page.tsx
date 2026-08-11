import { LiquidityDetailPage } from "@/features/liquidity/components/LiquidityDetailPage";

export default async function LiquidityDetailRoute({
  params,
}: PageProps<"/liquidity/detail/[id]">) {
  const { id } = await params;

  return <LiquidityDetailPage address={id} />;
}
