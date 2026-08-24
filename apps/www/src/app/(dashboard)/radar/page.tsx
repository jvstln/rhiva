import { RadarPage } from "@/features/market/components/MarketPage";

export default async function RadarRoute({
  searchParams,
}: PageProps<"/radar">) {
  const awaitedSearchParams = await searchParams;

  return <RadarPage searchParams={awaitedSearchParams} />;
}
