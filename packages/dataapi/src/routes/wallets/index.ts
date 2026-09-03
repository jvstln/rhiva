import { format } from "util";
import { ApiImpl } from "../../api-impl";
import type {
  WalletBalance,
  WalletCluster,
  WalletFee,
  WalletFunding,
  WalletPnl,
  WalletTrade,
  WalletPnlToken,
  WalletSaved,
  WalletTransfer,
  WalletPnlWithPosition,
} from "../../types";
import type {
  GetWalletBalanceParams,
  GetWalletClusterParams,
  GetWalletFeesParams,
  GetWalletFundingParams,
  GetWalletPnlParams,
  GetWalletPnlTokenParams,
  GetWalletSavedParams,
  GetWalletTradesParams,
  GetWalletTransfersParams,
} from "./types";

export class WalletApi extends ApiImpl {
  protected override path = "data/wallet";

  async getBalance(params: GetWalletBalanceParams): Promise<WalletBalance> {
    return await ApiImpl.getData<WalletBalance>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("balance"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getTransfers(
    params: GetWalletTransfersParams,
  ): Promise<WalletTransfer[]> {
    return await ApiImpl.getData<WalletTransfer[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("transfer"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getTrades(params: GetWalletTradesParams): Promise<WalletTrade[]> {
    return await ApiImpl.getData<WalletTrade[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("trades"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getFunding(params: GetWalletFundingParams): Promise<WalletFunding> {
    const [funding] = await ApiImpl.getData<WalletFunding[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("funding"), {
          chain: "solana",
          ...params,
        }),
      ),
    );

    return funding!;
  }

  async getCluster(params: GetWalletClusterParams): Promise<WalletCluster> {
    return await ApiImpl.getData<WalletCluster>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("cluster"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getFees(params: GetWalletFeesParams): Promise<WalletFee> {
    return await ApiImpl.getData<WalletFee>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("fees"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getPnl(
    params: GetWalletPnlParams & { position: true },
  ): Promise<WalletPnlWithPosition>;
  async getPnl(params: GetWalletPnlParams): Promise<WalletPnl>;
  async getPnl(
    params: GetWalletPnlParams,
  ): Promise<WalletPnl | WalletPnlWithPosition> {
    return await ApiImpl.getData<WalletPnl | WalletPnlWithPosition>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("pnl"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getPnlToken(params: GetWalletPnlTokenParams): Promise<WalletPnlToken> {
    return await ApiImpl.getData<WalletPnlToken>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("pnl/token"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getSavedWallet(
    params: GetWalletSavedParams,
  ): Promise<{ count: number; wallets: WalletSaved[] }> {
    return await ApiImpl.getData<{ count: number; wallets: WalletSaved[] }>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("saved"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async saveWallet(params: {
    wallet: string;
    note: string;
  }): Promise<{ count: number; wallets: WalletSaved[] }> {
    return await ApiImpl.getData<{ count: number; wallets: WalletSaved[] }>(
      this.xior.post(
        this.buildPathWithQueryString(this.buildPath("saved"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async unSaveWallet(
    wallet: string,
  ): Promise<{ count: number; wallets: WalletSaved[] }> {
    return await ApiImpl.getData<{ count: number; wallets: WalletSaved[] }>(
      this.xior.post(this.buildPath(format("saved/%s", wallet))),
    );
  }
}
