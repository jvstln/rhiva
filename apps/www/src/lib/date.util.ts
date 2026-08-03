import { intervalToDuration } from "date-fns";

/** "2d 5h", "45m" — compact duration label from a seconds count. */
export function formatAge(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return "-";

  const {
    days = 0,
    hours = 0,
    minutes = 0,
  } = intervalToDuration({
    start: 0,
    end: seconds * 1000,
  });

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
}
