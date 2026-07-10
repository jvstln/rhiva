export function formatCompactCurrency(value: number | null): string {
  if (value === null) return "N/A";

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}b`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

/** "+23.45%", "-4.10%" */
export function formatSignedPercent(value: number | null, digits = 2): string {
  if (value === null) return "N/A";

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** "511", "1.2k" — used for TXNS counts */
export function formatCompactNumber(value: number | null): string {
  if (value === null) return "N/A";

  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}
export function formatAge(unixTime: number | null): string {
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
