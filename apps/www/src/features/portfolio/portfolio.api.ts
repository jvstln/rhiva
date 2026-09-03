import { dataapi } from "@/lib";
import { getTokens } from "@/features/market/market.api";
import type { PortfolioPnl, PositionItem } from "./portfolio.type";

export const getTokenPortfolio = async (
  walletAddress: string,
): Promise<PortfolioPnl> => {
  const pnl = await dataapi.wallet.getPnl({
    address: walletAddress,
    position: true,
  });

  const positions = pnl.positions ?? [];
  const tokenMints = positions.map((p) => p.mint);
  const tokenDetails = await getTokens(tokenMints);
  const tokenMap = new Map(tokenDetails.map((t) => [t.mint, t]));

  const enrichedPositions: PositionItem[] = positions.map((p) => {
    const meta = tokenMap.get(p.mint);
    return {
      ...p,
      symbol: meta?.symbol,
      name: meta?.name,
      image: meta?.image ?? undefined,
      current_price_usd: meta?.price_usd,
    };
  });

  return {
    ...pnl,
    positions: enrichedPositions,
  };
};
