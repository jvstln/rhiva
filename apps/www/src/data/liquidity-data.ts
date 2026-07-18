export interface PoolRow {
  pair: string;
  tickSpacing: number;
  fee: string;
  age: string;
  marketCap: string;
  marketCapChange: string;
  tvl: string;
  tvlChange: string;
  activeTvl: string;
  activeTvlChange: string;
  fees: string;
  feesChange: string;
  feesRatio: string;
  feesRatioChange: string;
  volume: string;
  volumeChange: string;
  volumeRatio: string;
  volumeRatioChange: string;
}

function makePool(): PoolRow {
  return {
    pair: "SOL/USDC",
    tickSpacing: 1,
    fee: "0.001%",
    age: "2d 7h",
    marketCap: "$4.57M",
    marketCapChange: "-4.49%",
    tvl: "$118.7k",
    tvlChange: "0%",
    activeTvl: "$117.92k",
    activeTvlChange: "+255%",
    fees: "$4.26k",
    feesChange: "-10.18%",
    feesRatio: "3,64%",
    feesRatioChange: "+35.52%",
    volume: "$502.88k",
    volumeChange: "-5.59%",
    volumeRatio: "3,64%",
    volumeRatioChange: "+35.52%",
  };
}

export const POOLS: PoolRow[] = Array.from({ length: 12 }, () => makePool());

export const LIQUIDITY_SUMMARY = {
  tvl: "$721,004,307",
  volume24h: "$721,004,307",
  fees24h: "$721,004,307",
};

export const POOL_TABS = [
  "Watchlist",
  "Trending",
  "New Tokens",
  "RWA",
] as const;
export const POOL_TABLE_COLUMNS = [
  "Market Cap",
  "TVL",
  "Active TVL",
  "Fees",
  "Fees/Active TVL",
  "Volume",
  "Volume/Active TVL",
] as const;
