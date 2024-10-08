import { useEffect, useRef, useState } from "react";

export function useContainerMediaQuery(breakpoint: number) {
  const [matches, setMatches] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observerRef = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const container = entry.target;
        const computedStyle = window.getComputedStyle(container);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        const fullWidth = entry.contentRect.width + paddingLeft + paddingRight;

        if (fullWidth >= breakpoint) {
          setMatches(true);
        } else {
          setMatches(false);
        }
      }
    });
    if (observerRef) {
      observer.observe(observerRef);
    }
    return () => {
      if (observerRef) {
        observer.unobserve(observerRef);
      }
    };
  }, [breakpoint]);
  return { matches, containerRef };
}
