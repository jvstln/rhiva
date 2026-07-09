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

export function arrayWithId<T extends string | number>(
  arr: T[],
): Array<{ id: number; value: T }>;
export function arrayWithId<T extends object>(
  arr: T[],
): Array<T & { id: number }>;
export function arrayWithId(arr: number): Array<{ id: number }>;
export function arrayWithId(arrOrNumber: unknown[] | number) {
  if (typeof arrOrNumber === "number") {
    return Array.from({ length: arrOrNumber }, (_, id) => ({ id }));
  }

  return arrOrNumber.map((item, i) => {
    if (item !== null && typeof item === "object") {
      return { id: i, ...item };
    }
    return { id: i, value: item };
  });
}

export const capitalize = (str: string) => {
  return str.replace(
    /(^\w)|([_-]\w)|([a-z])([A-Z])/g,
    (_, firstLetter, withSeparator, endCamelCase, startCamelCase) => {
      if (firstLetter) return firstLetter.toUpperCase();
      if (withSeparator) return ` ${withSeparator[1].toUpperCase()}`;

      return `${endCamelCase} ${startCamelCase}`;
    },
  );
};

/** "$73.5k", "$1.2m", "$980" */
export * from "./finance.util";
