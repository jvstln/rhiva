export type WalletPnlToken = {
  wallet: "7xKX...";
  mint: "9BB6...";
  position: {
    holding: 34825695253;
    decimals: 6;
    cost_usd: 354.64;
    value_usd: 1466.52;
    realized_usd: 96935.58;
    unrealized_usd: -316.23;
    avg_buy_usd: 69.29;
    avg_sell_usd: 24.67;
    transferred_in: 0;
    transferred_out: 5000000000000;
    first_trade: 1779390632;
    last_trade: 1784999058;
  };
  trades: [
    {
      signature: "29SS...eQMx";
      slot: 361044215;
      block_time: 1786187001;
      dex: "pumpswap";
      pool: "8sLb...";
      side: "buy";
      price: 0.00056112;
      price_usd: 0.042109;
      volume_usd: 1263.27;
      base_amount: 30000000000000;
      quote_amount: 16833600000;
      base_decimals: 6;
      quote_decimals: 9;
      fee_amount: 42084000;
      fee_mint: "So11111111111111111111111111111111111111112";
      fee_pct: 0.25;
      price_impact_pct: 3.78;
    },
  ];
  transfers: [
    {
      signature: "4vC8...SvY1";
      slot: 361050001;
      block_time: 1786189440;
      kind: "transfer";
      direction: "out";
      counterparty: "DZ8b...";
      amount: 5000000000000;
      decimals: 6;
      value_usd: 210.54;
    },
  ];
};
