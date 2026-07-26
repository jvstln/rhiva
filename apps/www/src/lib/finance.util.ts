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
  if (value === null || value === undefined) return "N/A";
  const abs = Math.abs(Number(value));
  if (abs >= 1_000_000_000)
    return `$${(Number(value) / 1_000_000_000).toFixed(2)}b`;
  if (abs >= 1_000_000) return `$${(Number(value) / 1_000_000).toFixed(2)}m`;
  if (abs >= 1_000) return `$${(Number(value) / 1_000).toFixed(2)}k`;
  return `$${Number(value).toFixed(2)}`;
}

/** "+23.45%", "-4.10%" */
export function formatSignedPercent(value?: number | null, digits = 2): string {
  if (value === null || value === undefined) return "N/A";

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** "511", "1.2k" — used for TXNS counts */
export function formatCompactNumber(value?: number | null): string {
  if (value === null || value === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}
export function formatAge(unixTime?: number | null): string {
  if (!unixTime) return "N/A";
  const isSeconds = unixTime < 1e12;
  const timestamp = isSeconds ? unixTime * 1000 : unixTime;

  const diff = Date.now() - timestamp;
  if (diff < 0) return "N/A";

  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  if (diffMinutes > 0) return `${diffMinutes}m`;
  return `${diffSeconds}s`;
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
