import { MouseEventHandler } from "react";
import { SkeletonProps, Skeleton } from "./Skeleton";

export function Text({
  isLoading = false,
  onClick,
  children,
  className,
  skeletonSize = "md",
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  skeletonSize?: SkeletonProps["size"];
}) {
  return isLoading ? (
    <Skeleton size={skeletonSize} />
  ) : (
    <span className={className} onClick={onClick}>
      {children}
    </span>
  );
}
