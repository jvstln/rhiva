import { format } from "util";
import { debounce } from "lodash";
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

export function getRandomId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `sub_${Date.now()}_${Math.random().toString(36).slice(2)}`;
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
  if (!str) return str;

  return str.replace(
    /(^\w)|([_-]\w)|([a-z])([A-Z])/g,
    (_, firstLetter, withSeparator, endCamelCase, startCamelCase) => {
      if (firstLetter) return firstLetter.toUpperCase();
      if (withSeparator) return ` ${withSeparator[1].toUpperCase()}`;

      return `${endCamelCase} ${startCamelCase}`;
    },
  );
};

export function getInitials(name: string | null) {
  if (!name) return "--";

  let initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // If initials doesnt contains only one character
  if (initials.length === 1 && name.length > 1) {
    initials += name[1].toUpperCase();
  }

  return initials;
}

export async function share(params: Parameters<typeof navigator.share>[0]) {
  await navigator.share(params);
}

export const debounceInput = (func: () => void) => {
  debounce(func, 800)();
};

export * from "./error.util";
export * from "./finance.util";
export * from "./date.util";

export const truncateString = (value: string, length: number = 4) =>
  format("%s...%s", value.slice(0, length), value.slice(-length));
