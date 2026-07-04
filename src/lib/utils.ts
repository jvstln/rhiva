import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "paragraph",
            "b-1",
            "b-2",
            "b-3",
            "b-4",
            "b-5",
            "b-6",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export const arrayWithId = <T extends object[]>(arrOrNumber: T | number) => {
  if (typeof arrOrNumber === "number") {
    return Array.from({ length: arrOrNumber }, (_, id) => ({ id }));
  }

  return arrOrNumber.map((item, i) => ({ id: i, ...item }));
};

/** "$73.5k", "$1.2m", "$980" */
export * from "./finance.util";
