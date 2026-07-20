import { MarketPage } from "@/features/market/components/MarketPage";

export default async function MarketRoute({
  searchParams,
}: PageProps<"/market">) {
  const awaitedSearchParams = await searchParams;

  return <MarketPage searchParams={awaitedSearchParams} />;
}
