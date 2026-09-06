import { create } from "zustand";
import type {
  Window,
  WalletPnl,
  WalletBalance,
  WalletPnlHistory,
  WalletPnlPerformance,
} from "@rhivadotfun/dataapi";

type State = {
  wallet: string | null;
  balances: WalletBalance | null;
  pnl: WalletPnl | null;
  pnlHistories: WalletPnlHistory | null;
  pnlPerformance: WalletPnlPerformance<Window> | null;
};

type Action = {
  setWallet(wallet: string | null): void;
  setBalances(balances: WalletBalance | null): void;
  setPnl(pnl: WalletPnl | null): void;
  setPnlHistories(pnlHistories: WalletPnlHistory | null): void;
  setPnlPerformance(pnlPerformance: WalletPnlPerformance<Window> | null): void;
};

export const usePortfolio = create<State & Action>((set) => {
  return {
    pnl: null,
    wallet: null,
    balances: null,
    pnlHistories: null,
    pnlPerformance: null,
    setWallet(wallet) {
      set(() => ({ wallet }));
    },
    setBalances(balances) {
      set(() => ({ balances }));
    },
    setPnl(pnl) {
      set(() => ({ pnl }));
    },
    setPnlHistories(pnlHistories) {
      set(() => ({ pnlHistories }));
    },
    setPnlPerformance(pnlPerformance) {
      set(() => ({ pnlPerformance }));
    },
  };
});
