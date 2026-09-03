import * as React from "react";

const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
} as const;

export function useBreakpoint<K extends keyof typeof BREAKPOINTS>(query: K) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(BREAKPOINTS[query]);
    const handler = (event: MediaQueryListEvent | MediaQueryList) =>
      setMatches(event.matches);

    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
