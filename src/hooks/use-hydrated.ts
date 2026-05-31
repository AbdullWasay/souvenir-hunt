import { useLayoutEffect, useState } from "react";

/** True after client hydration — use to run motion without hiding SSR HTML. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useLayoutEffect(() => setHydrated(true), []);
  return hydrated;
}
