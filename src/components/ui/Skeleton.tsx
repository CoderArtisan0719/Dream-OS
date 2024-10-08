import { cn } from "@/utils/tailwind";

export interface SkeletonProps {
  size: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Skeleton({ size, className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "mb-1 animate-pulse rounded-[2px] bg-[#1D1D1D]",
        {
          "h-1.75 w-1/6 min-w-4": size === "sm",
          "h-2 w-2/6 min-w-8": size === "md",
          "h-3 w-2/6 min-w-12": size === "lg",
          "h-4.5 w-3/6 min-w-12": size === "xl",
        },
        className,
      )}
    />
  );
}
