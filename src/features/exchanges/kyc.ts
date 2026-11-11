// Does an exchange require ID verification (KYC)? No API provides this, so it's a hand-checked list
// for the top 25 exchanges by trust score, keyed by CoinGecko exchange id. Others show "—".
//
//   required = ID needed before you can trade
//   optional = trading and withdrawals up to a daily limit work without ID; more needs verification
//
// Rules change and often depend on the visitor's country. Re-check every few months and update
// KYC_CHECKED. Sources: each exchange's help center where available, otherwise news coverage of
// policy changes. Exchanges whose sources contradicted each other (BitKan, Bitunix) are left out.

export type KycPolicy = "required" | "optional";

export const KYC_CHECKED = "November 2026";

export const KYC_BY_EXCHANGE: Record<string, KycPolicy> = {
  gdax: "required", // Coinbase
  okex: "required", // OKX
  kraken: "required",
  binance: "required",
  bitget: "required", // mandatory for all users since 2023
  gate: "required", // help center: mandatory to deposit and withdraw
  crypto_com: "required",
  bitstamp: "required",
  bitvavo: "required",
  bingx: "optional", // unverified: 20,000 USDT / 24h (BingX support)
  kucoin: "required", // mandatory for all users since 2023
  lbank: "optional", // required in some regions
  weex: "optional", // unverified: 10,000 USDT / day (WEEX wiki)
  toobit: "optional",
  coinw: "optional", // unverified: 2 BTC / day
  hashkey: "required", // licensed in Hong Kong
  upbit: "required", // Korean real-name accounts
  ourbit: "optional",
  mxc: "optional", // MEXC
  bitkub: "required", // licensed in Thailand
  bullish_com: "required",
  whitebit: "required", // help center: demo tokens only without KYC
  bybit_spot: "required", // mandatory for all services since May 2023
};
