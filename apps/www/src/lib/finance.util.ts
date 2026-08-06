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

/**
 * formatCompactNumber
 * ---------------------------------------------------------------------------
 * Formats a number into a compact, human-readable string.
 *
 * Rules implemented:
 *  - Large numbers get an uppercase unit suffix: 5_000        -> "5K"
 *                                                 5_640        -> "5.64K"
 *                                                 1_500_000    -> "1.5M"
 *  - At most 2 decimal places are ever shown, and trailing zeros
 *    are trimmed (100.00K -> "100K", 1.50M -> "1.5M").
 *  - Very small decimals (lots of leading zeros after the decimal point)
 *    are shown with a subscript zero-count instead of a long string of
 *    zeros:            0.00004272   -> "0.0₄427"
 *                       0.0000000493 -> "0.0₇493"
 *
 * Usage:
 *   formatCompactNumber(5000)            // "5K"
 *   formatCompactNumber(5640)            // "5.64K"
 *   formatCompactNumber(1500000)         // "1.5M"
 *   formatCompactNumber(0.00004272)      // "0.0₄427"
 *   formatCompactNumber("0.0000000493")  // "0.0₇493"
 *   formatCompactNumber(-1234)           // "-1.23K"
 */

export interface FormatCompactNumberOptions {
  /** Max decimal places shown for "normal" (non-subscript) numbers. Default: 2 */
  decimals?: number;
  /** How many significant digits to show after the subscript zero-count. Default: 3 */
  significantDigits?: number;
  /**
   * Minimum number of leading zeros (after the decimal point) required
   * before switching to subscript notation. Default: 4
   * (i.e. 0.001 stays "0.00", but 0.0001 becomes "0.0₃1" if it had 3 zeros? no -
   * it only kicks in once leadingZeros > this value's threshold - 1)
   */
  subscriptThreshold?: number;
  /** Fallback string returned for NaN / Infinity / -Infinity. Default: "0" */
  fallback?: string;
  /** If true, appends + or - to the formatted number */
  withSign?: boolean;
}

const UNITS: ReadonlyArray<readonly [threshold: number, suffix: string]> = [
  [1e12, "T"],
  [1e9, "B"],
  [1e6, "M"],
  [1e3, "K"],
];

// const SUBSCRIPT_DIGITS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
/** Converts e.g. 12 -> "₁₂" */
function toSubscript(n: number): string {
  return String(n)
    .split("")
    .map((digit) => String.fromCharCode(8320 + parseInt(digit, 10)))
    .join("");
}

/** "5.6400" -> "5.64", "100.00" -> "100", "5" -> "5" */
function trimTrailingZeros(numericString: string): string {
  if (!numericString.includes(".")) return numericString;
  return numericString.replace(/0+$/, "").replace(/\.$/, "");
}

/**
 * For a number strictly between 0 and 1, returns how many zeros appear
 * right after the decimal point before the first significant digit, plus
 * that many significant digits, e.g. 0.00004272 -> { leadingZeros: 4, digits: "427" }
 */
function getLeadingZerosAndDigits(
  value: number,
  significantDigits: number,
): { leadingZeros: number; digits: string } {
  // toExponential gives us an exact, rounded mantissa + exponent without
  // manually walking long decimal strings (which can misbehave for very
  // small floats due to binary floating point representation).
  const [mantissa, exponentPart] = value
    .toExponential(significantDigits - 1)
    .split("e");

  const exponent = Number(exponentPart);
  const leadingZeros = -exponent - 1;
  const digits = mantissa.replace(".", "").replace("-", "");

  return { leadingZeros, digits };
}

export function formatCompactNumber(
  value?: string | number | null,
  options: FormatCompactNumberOptions = {},
): string {
  const {
    decimals = 2,
    significantDigits = 3,
    subscriptThreshold = 4,
    fallback = "-",
  } = options;

  const num = Number(value);

  if (!Number.isFinite(num)) return fallback;
  if (num === 0) return "0";

  const sign = num < 0 ? "-" : options.withSign ? "+" : "";
  const abs = Math.abs(num);

  // --- Large numbers: apply K / M / B / T suffix -----------------------
  for (const [threshold, suffix] of UNITS) {
    if (abs >= threshold) {
      const scaled = (abs / threshold).toFixed(decimals);
      return `${sign}${trimTrailingZeros(scaled)}${suffix}`;
    }
  }

  // --- Numbers >= 1 (no unit needed) ------------------------------------
  if (abs >= 1) {
    return `${sign}${trimTrailingZeros(abs.toFixed(decimals))}`;
  }

  // --- Small decimals (< 1): check for a long run of leading zeros -----
  const { leadingZeros, digits } = getLeadingZerosAndDigits(
    abs,
    significantDigits,
  );

  if (leadingZeros >= subscriptThreshold) {
    return `${sign}0.0${toSubscript(leadingZeros)}${digits}`;
  }

  // Not enough leading zeros to bother with subscript notation.
  return `${sign}${trimTrailingZeros(abs.toFixed(decimals))}`;
}

export function formatCompactCurrency(value?: number | string | null): string {
  return `$${formatCompactNumber(value)}`;
}

/** "+$23.45", "-$4.10" — signed USD for PnL displays */
export function formatSignedUsd(value?: number | null): string {
  if (value === null || value === undefined) return "-";
  return `${value < 0 ? "-" : "+"}${formatCompactCurrency(Math.abs(value))}`;
}

/** "+23.45%", "-4.10%" */
export function formatSignedPercent(value?: string | number | null): string {
  if (value === null || value === undefined) return "-";

  return `${formatCompactNumber(value)}%`;
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
