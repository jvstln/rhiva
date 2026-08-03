import {
  NetworkBitcoin,
  NetworkEthereum,
  NetworkSolana,
} from "@web3icons/react";
import {
  Coins,
  DollarSign,
  Euro,
  IndianRupee,
  JapaneseYen,
  PoundSterling,
  SwissFranc,
} from "lucide-react";

export function formatCompactCurrency(value?: number | string | null): string {
  if (value === null || value === undefined) return "-";
  const abs = Math.abs(Number(value));
  if (abs >= 1_000_000_000)
    return `$${(Number(value) / 1_000_000_000).toFixed(2)}b`;
  if (abs >= 1_000_000) return `$${(Number(value) / 1_000_000).toFixed(2)}m`;
  if (abs >= 1_000) return `$${(Number(value) / 1_000).toFixed(2)}k`;
  return `$${Number(value).toFixed(2)}`;
}

/** "+$23.45", "-$4.10" — signed USD for PnL displays */
export function formatSignedUsd(value?: number | null): string {
  if (value === null || value === undefined) return "-";
  return `${value < 0 ? "-" : "+"}${formatCompactCurrency(Math.abs(value))}`;
}

/** "+23.45%", "-4.10%" */
export function formatSignedPercent(
  value?: string | number | null,
  digits = 2,
): string {
  if (value === null || value === undefined) return "-";

  const sign = Number(value) > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(digits)}%`;
}

/** "511", "1.2k" — used for TXNS counts */
export function formatCompactNumber(value?: number | null): string {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export const currencies = [
  { value: "USD", symbol: "$", icon: DollarSign, label: "US Dollar" },
  { value: "SOL", symbol: "SOL", icon: NetworkSolana, label: "Solana" },
  { value: "NGN", symbol: "₦", icon: Coins, label: "Nigerian Naira" },
  { value: "EUR", symbol: "€", icon: Euro, label: "Euro" },
  { value: "GBP", symbol: "£", icon: PoundSterling, label: "British Pound" },
  { value: "JPY", symbol: "¥", icon: JapaneseYen, label: "Japanese Yen" },
  { value: "INR", symbol: "₹", icon: IndianRupee, label: "Indian Rupee" },
  { value: "CHF", symbol: "Fr", icon: SwissFranc, label: "Swiss Franc" },
  { value: "BTC", symbol: "BTC", icon: NetworkBitcoin, label: "Bitcoin" },
  { value: "ETH", symbol: "ETH", icon: NetworkEthereum, label: "Ethereum" },
];

export function formatNumberWithSubscriptZeros(
  value: string | number = 0,
  intl?: Intl.NumberFormat,
): string {
  const valueIsString = typeof value === "string";
  const valueNumber = valueIsString ? parseFloat(value) : value;
  if (!Number.isFinite(valueNumber))
    return valueIsString ? value : valueNumber.toString();

  const [wholeNumber, fractionalNumber] = valueNumber
    .toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 })
    .split(/\./g);

  if (wholeNumber === "0" && fractionalNumber && fractionalNumber.length > 2) {
    let leadingZeros = 0;
    for (let index = 0; index < fractionalNumber.length; index++) {
      if (fractionalNumber[index] === "0") leadingZeros++;
      else break;
    }

    if (leadingZeros > 3) {
      const sub = leadingZeros
        .toString()
        .split("")
        .map((digit) => String.fromCharCode(8320 + parseInt(digit, 10)))
        .join("");

      return `0.0${sub}${fractionalNumber.slice(leadingZeros, leadingZeros + 3)}`;
    }

    return valueNumber.toFixed(Math.min(leadingZeros + 1, 20));
  }

  return intl ? intl.format(valueNumber) : value.toString();
}
