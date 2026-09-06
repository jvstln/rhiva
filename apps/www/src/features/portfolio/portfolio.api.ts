import { dataapi } from "@/lib";
import { getTokens } from "@/features/market/market.api";
import type { PortfolioPnl, PositionItem } from "./portfolio.type";

export const getTokenPortfolio = async (
  walletAddress: string,
): Promise<PortfolioPnl> => {
  if (!walletAddress) {
    return {
      wallet: "",
      updated_time: Date.now(),
      total_usd: 0,
      realized_usd: 0,
      unrealized_usd: 0,
      invested_usd: 0,
      proceeds_usd: 0,
      roi_pct: 0,
      summary: {
        total_value_usd: 0,
        total_value_sol: 0,
        unrealized_pnl_usd: 0,
        unrealized_pnl_sol: 0,
        tradeable_value_usd: 0,
        tradeable_value_sol: 0,
        realized_pnl_usd: 0,
        pnl_usd: 0,
        pnl_pct: 0,
        pnl_change_usd: 0,
        sol_usd_rate: 0,
        total_value_change_usd: 0,
        unrealized_pnl_change_usd: 0,
        tradeable_value_change_usd: 0,
      },
      wins: 0,
      losses: 0,
      buys: 0,
      sells: 0,
      tokens_traded: 0,
      first_trade: 0,
      last_trade: 0,
      positions: [],
    };
  }

  const pnl = await dataapi.wallet.getPnl({
    address: walletAddress,
    position: true,
  });

  const positions = pnl.positions ?? [];
  const tokenMints = positions.map((p) => p.mint);
  const tokenDetails = tokenMints.length > 0 ? await getTokens(tokenMints) : [];
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
