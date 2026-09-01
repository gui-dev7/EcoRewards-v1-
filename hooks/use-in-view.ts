"use client";

import { useEffect, useRef, useState } from "react";

/** Dispara uma única vez quando o elemento entra no viewport. */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  margin = "0px 0px -15% 0px",
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin, inView]);

  return { ref, inView };
}
