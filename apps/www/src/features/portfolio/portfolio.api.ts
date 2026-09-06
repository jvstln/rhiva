import { dataapi } from "@/lib";
import { getTokens } from "@/features/market/market.api";
import type {
  WalletBalance,
  WalletFee,
  WalletFunding,
  WalletPnlHistory,
  WalletPnlPerformance,
  WalletTrade,
  WalletTransfer,
} from "@rhivadotfun/dataapi";
import type { PortfolioPnl, PositionItem } from "./portfolio.type";
import {
  DEMO_FEES,
  DEMO_FUNDING,
  DEMO_PORTFOLIO_HISTORY,
  DEMO_PORTFOLIO_PERFORMANCE,
  DEMO_PORTFOLIO_PNL,
  DEMO_TRADES,
  DEMO_TRANSFERS,
  DEMO_WALLET_ADDRESS,
  DEMO_WALLET_BALANCE,
} from "./portfolio.demo";

export const getTokenPortfolio = async (
  walletAddress: string,
): Promise<PortfolioPnl> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_PORTFOLIO_PNL;
  }

  try {
    const pnl = await dataapi.wallet.getPnl({
      address: walletAddress,
      position: true,
    });

    const positions = pnl.positions ?? [];
    if (positions.length === 0 && (!pnl.total_usd || pnl.total_usd === 0)) {
      return {
        ...DEMO_PORTFOLIO_PNL,
        wallet: walletAddress,
      };
    }

    const tokenMints = positions.map((p) => p.mint);
    const tokenDetails =
      tokenMints.length > 0 ? await getTokens(tokenMints) : [];
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
  } catch {
    return {
      ...DEMO_PORTFOLIO_PNL,
      wallet: walletAddress,
    };
  }
};

export const getWalletBalance = async (
  walletAddress: string,
): Promise<WalletBalance> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_WALLET_BALANCE;
  }

  try {
    const balance = await dataapi.wallet.getBalance({ address: walletAddress });
    if (!balance?.tokens || balance.tokens.length === 0) {
      return {
        ...DEMO_WALLET_BALANCE,
        wallet: walletAddress,
      };
    }
    return balance;
  } catch {
    return {
      ...DEMO_WALLET_BALANCE,
      wallet: walletAddress,
    };
  }
};

export const getWalletPnlHistory = async (
  walletAddress: string,
): Promise<WalletPnlHistory[]> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_PORTFOLIO_HISTORY;
  }

  try {
    const history = await dataapi.wallet.getPnlHistory({
      address: walletAddress,
    });
    if (!history || history.length === 0) {
      return DEMO_PORTFOLIO_HISTORY;
    }
    return history;
  } catch {
    return DEMO_PORTFOLIO_HISTORY;
  }
};

export const getWalletPnlPerformance = async (
  walletAddress: string,
): Promise<WalletPnlPerformance<any>> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_PORTFOLIO_PERFORMANCE;
  }

  try {
    const perf = await dataapi.wallet.getPnlPerformance({
      address: walletAddress,
    });
    if (!perf || perf.length === 0) {
      return {
        ...DEMO_PORTFOLIO_PERFORMANCE,
        wallet: walletAddress,
      };
    }
    return perf[0];
  } catch {
    return {
      ...DEMO_PORTFOLIO_PERFORMANCE,
      wallet: walletAddress,
    };
  }
};

export const getWalletTrades = async (
  walletAddress: string,
): Promise<WalletTrade[]> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_TRADES;
  }

  try {
    const trades = await dataapi.wallet.getTrades({ address: walletAddress });
    if (!trades || trades.length === 0) {
      return DEMO_TRADES;
    }
    return trades;
  } catch {
    return DEMO_TRADES;
  }
};

export const getWalletTransfers = async (
  walletAddress: string,
): Promise<WalletTransfer[]> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_TRANSFERS;
  }

  try {
    const transfers = await dataapi.wallet.getTransfers({
      address: walletAddress,
    });
    if (!transfers || transfers.length === 0) {
      return DEMO_TRANSFERS;
    }
    return transfers;
  } catch {
    return DEMO_TRANSFERS;
  }
};

export const getWalletFunding = async (
  walletAddress: string,
): Promise<WalletFunding> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_FUNDING;
  }

  try {
    const funding = await dataapi.wallet.getFunding({ address: walletAddress });
    if (!funding?.first_funder) {
      return {
        ...DEMO_FUNDING,
        wallet: walletAddress,
      };
    }
    return funding;
  } catch {
    return {
      ...DEMO_FUNDING,
      wallet: walletAddress,
    };
  }
};

export const getWalletFees = async (
  walletAddress: string,
): Promise<WalletFee> => {
  if (!walletAddress || walletAddress === DEMO_WALLET_ADDRESS) {
    return DEMO_FEES;
  }

  try {
    const fees = await dataapi.wallet.getFees({ address: walletAddress });
    if (!fees?.venues) {
      return {
        ...DEMO_FEES,
        wallet: walletAddress,
      };
    }
    return fees;
  } catch {
    return {
      ...DEMO_FEES,
      wallet: walletAddress,
    };
  }
};
