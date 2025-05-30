import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for debouncing function calls
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export  function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clean up any pending debounce on unmount
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}