import { ApiImpl } from "../../api-impl";
import type {
  GetGraduatedParams,
  GetGraduatingParams,
  GetLaunchesParams,
  GetMetadataMultiParams,
  GetMetadataParams,
  GetMoversParams,
  GetRecentTradesParams,
  GetScreenerParams,
  GetTokenAthParams,
  GetTokenCreationParams,
  GetTokenDevHistoryParams,
  GetTokenDuplicatesParams,
  GetTokenFeesParams,
  GetTokenFirstBuyersParams,
  GetTokenHoldersParams,
  GetTokenLiquidityParams,
  GetTokenOhlvcParams,
  GetTokenParams,
  GetTokenPoolsParams,
  GetTokenPriceAtParams,
  GetTokenPriceHistoryParams,
  GetTokenPriceMultiParams,
  GetTokenPriceParams,
  GetTokenRiskIntelParams,
  GetTokenSecurityParams,
  GetTokensParams,
  GetTokenStatsParams,
  GetTokenSupplyParams,
  GetTokenTradesParams,
  GetTopTradersParams,
  GetTrendingParams,
  GetWhaleTradesParams,
  SearchTokenParams,
} from "./types";
import type {
  TokenAth,
  TokenCreation,
  TokenDevHistory,
  TokenFees,
  TokenFirstBuyer,
  TokenFull,
  TokenGraduated,
  TokenGraduating,
  TokenHolders,
  TokenHoldersChart,
  TokenLaunch,
  TokenMetadata,
  TokenMover,
  TokenPool,
  TokenRiskIntel,
  TokenScreener,
  TokenSearch,
  TokenSearchEnrich,
  TokenSecurity,
  TokenStats,
  TokenSupply,
  TokenTopTrader,
  TokenTrending,
  Token,
  TokenLiquidity,
  TokenOHlvc,
  TokenPriceHistory,
  TokenPrice,
  TokenPriceWithLiquidity,
  TradeLarge,
  TokenRecentTrade,
  TokenTrade,
} from "../../types";

export class TokenApi extends ApiImpl {
  protected override path = "data/token";

  readonly getMetadata = async (
    params: GetMetadataParams,
  ): Promise<TokenMetadata> => {
    const [data] = await ApiImpl.getData<TokenMetadata[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("metadata"), {
          chain: "solana",
          ...params,
        }),
      ),
    );

    return data!;
  };

  readonly getMetadataMulti = async (
    params: GetMetadataMultiParams,
  ): Promise<TokenMetadata[]> => {
    return await ApiImpl.getData<TokenMetadata[]>(
      this.xior.post(this.buildPath("metadata"), {
        chain: "solana",
        ...params,
      }),
    );
  };

  readonly getToken = async (params: GetTokenParams): Promise<TokenFull> => {
    return await ApiImpl.getData<TokenFull>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("full"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenCreation = async (
    params: GetTokenCreationParams,
  ): Promise<TokenCreation> => {
    return await ApiImpl.getData<TokenCreation>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("creation"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  async getTokenStats<T extends "300" | "3600" | "8640">(
    params: GetTokenStatsParams<T> & { enrich: true },
  ): Promise<TokenStats<T> & TokenFull>;
  async getTokenStats<T extends "300" | "3600" | "8640">(
    params: GetTokenStatsParams<T>,
  ): Promise<TokenStats<T>>;
  async getTokenStats<T extends "300" | "3600" | "8640">(
    params: GetTokenStatsParams<T> & { enrich?: boolean },
  ): Promise<(TokenStats<T> & TokenFull) | TokenStats<T>> {
    return await ApiImpl.getData<(TokenStats<T> & TokenFull) | TokenStats<T>>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("creation"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  readonly getTokenAth = async (
    params: GetTokenAthParams,
  ): Promise<TokenAth> => {
    return await ApiImpl.getData<TokenAth>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("ath"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenSupply = async (
    params: GetTokenSupplyParams,
  ): Promise<TokenSupply> => {
    const [supply] = await ApiImpl.getData<TokenSupply[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("supply"), {
          chain: "solana",
          ...params,
        }),
      ),
    );

    return supply!;
  };

  readonly getTokenSecurity = async (
    params: GetTokenSecurityParams,
  ): Promise<TokenSecurity> => {
    return await ApiImpl.getData<TokenSecurity>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("security"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenRiskIntel = async (
    params: GetTokenRiskIntelParams,
  ): Promise<TokenRiskIntel> => {
    return await ApiImpl.getData<TokenRiskIntel>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("intel"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenDevHistory = async (
    params: GetTokenDevHistoryParams,
  ): Promise<TokenDevHistory> => {
    return await ApiImpl.getData<TokenDevHistory>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("dev"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenDuplicates = async (params: GetTokenDuplicatesParams) => {
    return await ApiImpl.getData<TokenDevHistory>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("duplicates"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenPools = async (
    params: GetTokenPoolsParams,
  ): Promise<TokenPool[]> => {
    return await ApiImpl.getData<TokenPool[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("pools"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenHolders = async (
    params: GetTokenHoldersParams,
  ): Promise<TokenHolders> => {
    return await ApiImpl.getData<TokenHolders>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("holders"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenHoldersChart = async (
    params: GetTokenHoldersParams,
  ): Promise<TokenHoldersChart[]> => {
    return await ApiImpl.getData<TokenHoldersChart[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("holders"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenFirstBuyers = async (
    params: GetTokenFirstBuyersParams,
  ): Promise<TokenFirstBuyer[]> => {
    return await ApiImpl.getData<TokenFirstBuyer[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("first-buyers"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTopTraders = async (
    params: GetTopTradersParams,
  ): Promise<TokenTopTrader[]> => {
    return await ApiImpl.getData<TokenTopTrader[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("top-traders"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getTokenFees = async (
    params: GetTokenFeesParams,
  ): Promise<TokenFees[]> => {
    return await ApiImpl.getData<TokenFees[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("fees"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  async searchToken(
    params: SearchTokenParams & {
      enrich: true;
    },
  ): Promise<TokenSearch[]>;
  async searchToken(params: SearchTokenParams): Promise<TokenSearchEnrich[]>;
  async searchToken(
    params: SearchTokenParams & { enrich?: boolean },
  ): Promise<(TokenSearch | TokenSearchEnrich)[]> {
    return await ApiImpl.getData<(TokenSearch | TokenSearchEnrich)[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("search"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  readonly getLaunches = async (
    params: GetLaunchesParams,
  ): Promise<TokenLaunch[]> => {
    return await ApiImpl.getData<TokenLaunch[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("launches"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  getGraduating(
    params: GetGraduatingParams & { enrich: true },
  ): Promise<(TokenGraduating & { token: TokenFull })[]>;
  getGraduating(params: GetGraduatingParams): Promise<TokenGraduating[]>;
  async getGraduating(
    params: GetGraduatingParams & { enrich?: boolean },
  ): Promise<((TokenGraduating & { token: TokenFull }) | TokenGraduating)[]> {
    return await ApiImpl.getData<
      ((TokenGraduating & { token: TokenFull }) | TokenGraduating)[]
    >(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("graduating"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getGraduated(
    params: GetGraduatedParams & { enrich: true },
  ): Promise<(TokenGraduated & { token: TokenFull })[]>;
  async getGraduated(params: GetGraduatedParams): Promise<TokenGraduated[]>;
  async getGraduated(
    params: GetGraduatedParams & {
      enrich?: boolean;
    },
  ): Promise<((TokenGraduated & { token: TokenFull }) | TokenGraduated)[]> {
    return await ApiImpl.getData<
      ((TokenGraduated & { token: TokenFull }) | TokenGraduated)[]
    >(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("graduated"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  getTrending(
    params: GetTrendingParams & { enrich: true },
  ): Promise<(TokenTrending & { token: TokenFull })[]>;
  getTrending(params: GetTrendingParams): Promise<TokenTrending[]>;
  async getTrending(
    params: GetTrendingParams & {
      enrich?: boolean;
    },
  ): Promise<((TokenTrending & { token: TokenFull }) | TokenTrending)[]> {
    return await ApiImpl.getData<
      ((TokenTrending & { token: TokenFull }) | TokenTrending)[]
    >(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("trending"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  getMovers(
    params: GetMoversParams & {
      enrich: true;
    },
  ): Promise<(TokenMover & { token: TokenFull })[]>;
  getMovers(params: GetMoversParams): Promise<TokenMover[]>;
  async getMovers(
    params: GetMoversParams & {
      enrich?: boolean;
    },
  ): Promise<((TokenMover & { token: TokenFull }) | TokenMover)[]> {
    return await ApiImpl.getData<
      ((TokenMover & { token: TokenFull }) | TokenMover)[]
    >(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("movers"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  readonly getTokens = async (params: GetTokensParams): Promise<Token[]> => {
    return await ApiImpl.getData<Token[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("list"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  readonly getScreener = async (
    params: GetScreenerParams,
  ): Promise<TokenScreener[]> => {
    return await ApiImpl.getData<TokenScreener[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("screener"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  };

  getTokenPrice(
    params: GetTokenPriceParams & { liquidity: true },
  ): Promise<TokenPriceWithLiquidity>;
  getTokenPrice(params: GetTokenPriceParams): Promise<TokenPrice>;
  async getTokenPrice(
    params: GetTokenPriceParams & { liquidity?: boolean },
  ): Promise<TokenPrice | TokenPriceWithLiquidity> {
    const [price] = await ApiImpl.getData<
      (TokenPrice | TokenPriceWithLiquidity)[]
    >(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("price"), {
          chain: "solana",
          ...params,
        }),
      ),
    );

    return price!;
  }

  async getTokenPriceMulti(
    params: GetTokenPriceMultiParams & { liquidity: true },
  ): Promise<TokenPriceWithLiquidity[]>;
  async getTokenPriceMulti(
    params: GetTokenPriceMultiParams,
  ): Promise<TokenPrice[]>;
  async getTokenPriceMulti(
    params: GetTokenPriceMultiParams & { liquidity?: boolean },
  ) {
    return await ApiImpl.getData<TokenPrice[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("price"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getTokenPriceHistory(
    params: GetTokenPriceHistoryParams,
  ): Promise<TokenPriceHistory[]> {
    return await ApiImpl.getData<TokenPriceHistory[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("price/at"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getPriceAt(params: GetTokenPriceAtParams): Promise<TokenPrice[]> {
    return await ApiImpl.getData<TokenPrice[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("price/at"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getTokenOhlcv(params: GetTokenOhlvcParams): Promise<TokenOHlvc[]> {
    return await ApiImpl.getData<TokenOHlvc[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("ohlvc"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getTokenLiquidity(
    params: GetTokenLiquidityParams,
  ): Promise<TokenLiquidity> {
    return await ApiImpl.getData<TokenLiquidity>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("liquidity"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getTokenTrades(params: GetTokenTradesParams): Promise<TokenTrade[]> {
    return await ApiImpl.getData<TokenTrade[]>(
      this.xior.get(
        this.buildPathWithQueryString(this.buildPath("trades"), {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getRecentTrades(params: GetRecentTradesParams) {
    return await ApiImpl.getData<TokenRecentTrade[]>(
      this.xior.get(
        this.buildPathWithQueryString("trades/recent", {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }

  async getWhaleTrades(params: GetWhaleTradesParams): Promise<TradeLarge[]> {
    return await ApiImpl.getData<TradeLarge[]>(
      this.xior.get(
        this.buildPathWithQueryString("trades/large", {
          chain: "solana",
          ...params,
        }),
      ),
    );
  }
}
