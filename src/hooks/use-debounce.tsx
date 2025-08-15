import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300) {
  const [debounceValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounceValue;
}
