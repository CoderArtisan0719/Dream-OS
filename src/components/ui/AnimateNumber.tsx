import { useLayoutEffect, useState } from "react";
import { Skeleton } from "./Skeleton";

interface AnimateNumberProp {
  duration?: number;
  className?: string;
  children: number;
  format?: (arg: number) => any;
  isLoading?: boolean;
}

export function AnimateNumber({
  duration = 1000,
  children,
  format,
  className,
  isLoading = false,
}: AnimateNumberProp) {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = Math.floor(progress * children);

      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [children, duration]);

  return isLoading ? (
    <Skeleton size="md" />
  ) : (
    <p className={`${className}`}>{format ? format(count || 0) : count}</p>
  );
}
