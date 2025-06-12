"use client";

import { useEffect, useState } from "react";

interface UseScrollOptions {
  threshold?: number;
}

export function useScroll({ threshold = 10 }: UseScrollOptions = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > threshold);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrolled;
}
