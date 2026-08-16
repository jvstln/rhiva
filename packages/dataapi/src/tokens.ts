import type { XiorInstance } from "xior";
import { format } from "util";
import type {
	BundlersQuery,
	BundlersResponse,
	Candle,
	CandlesQuery,
	CtoFlagRow,
	InsidersResponse,
	MetaQuery,
	RugcheckResponse,
	SafetyView,
	ScreenerQuery,
	ScreenerRow,
	SnipersQuery,
	SnipersResponse,
	SurgeQuery,
	SurgeRow,
	TokenDetail,
	TokenMetaEntry,
	TokenPortfolioResponse,
	TokensQuery,
	TopTrader,
	TopTradersQuery,
	TradeRow,
	TradesQuery,
	TrenchesQuery,
	TrenchesRow,
	TrendingEntry,
	TrendingMultiQuery,
	TrendingQuery,
	TrendingRow,
	WalletFundingView,
	WalletTagRow,
} from "./types";

export class TokensApi {
	constructor(private client: XiorInstance) {}

	private get<T>(url: string, params?: object) {
		return this.client.get<T>(url, { params }).then((res) => res.data);
	}

	getHealth() {
		return this.get<string>("/health");
	}
	getTrenches(query?: TrenchesQuery) {
		return this.get<TrenchesRow[]>("/trenches", query);
	}
	getTrending(query?: TrendingQuery) {
		return this.get<TrendingEntry[]>("/trending", query);
	}
	getTrendingMulti(query?: TrendingMultiQuery) {
		return this.get<TrendingRow[]>("/trending/multi", query);
	}
	getTokenDetail(mint: string) {
		return this.get<TokenDetail | null>(format("/token/%s", mint));
	}
	getTokensBatch(query?: TokensQuery) {
		return this.get<TokenDetail[]>("/tokens", query);
	}
	getTokenCandles(mint: string, query?: CandlesQuery) {
		return this.get<Candle[]>(format("/token/%s/candles", mint), query);
	}
	getTokenTrades(mint: string, query?: TradesQuery) {
		return this.get<TradeRow[]>(format("/token/%s/trades", mint), query);
	}
	getTokenTopTraders(mint: string, query?: TopTradersQuery) {
		return this.get<TopTrader[]>(format("/token/%s/top-traders", mint), query);
	}
	getTokenSnipers(mint: string, query?: SnipersQuery) {
		return this.get<SnipersResponse>(format("/token/%s/snipers", mint), query);
	}
	getTokenBundlers(mint: string, query?: BundlersQuery) {
		return this.get<BundlersResponse>(
			format("/token/%s/bundlers", mint),
			query,
		);
	}
	getTokenInsiders(mint: string) {
		return this.get<InsidersResponse>(format("/token/%s/insiders", mint));
	}
	getTokenSafety(mint: string) {
		return this.get<SafetyView>(format("/token/%s/safety", mint));
	}
	getTokenRugcheck(mint: string) {
		return this.get<RugcheckResponse>(format("/token/%s/rugcheck", mint));
	}
	getTokenCtoFlag(mint: string) {
		return this.get<CtoFlagRow | null>(format("/token/%s/cto-flag", mint));
	}
	getTokenMeta(query?: MetaQuery) {
		return this.get<TokenMetaEntry[]>("/meta", query);
	}
	getScreener(query?: ScreenerQuery) {
		return this.get<ScreenerRow[]>("/screener", query);
	}
	getSurge(query?: SurgeQuery) {
		return this.get<SurgeRow[]>("/surge", query);
	}
	getTokenPortfolio(wallet: string) {
		return this.get<TokenPortfolioResponse>(
			format("/token-portfolio/%s", wallet),
		);
	}
	getWalletFunding(wallet: string) {
		return this.get<WalletFundingView[]>(format("/wallet/%s/funding", wallet));
	}
	getWalletTags(wallet: string) {
		return this.get<WalletTagRow[]>(format("/wallet/%s/tags", wallet));
	}
}
