import LiquidityPoolPage from "@/features/liquidity/components/LiquidityPoolPage";

export default async function LiquidityPoolRoute({
  params,
}: PageProps<"/liquidity/pool/[id]">) {
  const { id } = await params;

  return <LiquidityPoolPage id={id} />;
}
