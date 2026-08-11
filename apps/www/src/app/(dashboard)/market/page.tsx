import { MarketLiveData } from "@/features/market/components/MarketLiveData";
import { MarketPage } from "@/features/market/components/MarketPage";

export default async function MarketRoute({
  searchParams,
}: PageProps<"/market">) {
  const awaitedSearchParams = await searchParams;

  return (
    <MarketLiveData>
      <MarketPage searchParams={awaitedSearchParams} />
    </MarketLiveData>
  );
}
