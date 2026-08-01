import type z from "zod";
import type { jitoConfigSchema } from "@rhivadotfun/api";

import type { PriorityLevel } from "./settings.type";

export const toJitoPriorityLevel = (
  level: PriorityLevel,
): NonNullable<
  Extract<
    z.infer<typeof jitoConfigSchema>,
    { feeMode: "dynamic" }
  >["priorityLevel"]
> => {
  switch (level) {
    case "fast":
      return "50ema";
    case "turbo":
      return "75";
    case "ultra":
      return "99";
  }
};
